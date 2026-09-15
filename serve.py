#!/usr/bin/env python3
"""Local dev server for the 41039 site.

python3 -m http.server is not enough: CheerpJ fetches the Java runtime and
vendor/ecj.jar with HTTP Range requests, which SimpleHTTPRequestHandler does not
implement. Without Range support the console prints
"HTTP server does not support the 'Range' header. CheerpJ cannot run."

Usage:  python3 serve.py [port]      (default 8000)
"""
import http.server
import os
import re
import socketserver
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))


class RangeHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def send_head(self):
        rng = self.headers.get("Range")
        if not rng:
            return super().send_head()

        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        try:
            f = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        size = os.fstat(f.fileno()).st_size
        m = re.match(r"bytes=(\d*)-(\d*)$", rng.strip())
        if not m:
            f.close()
            self.send_error(400, "Invalid Range header")
            return None

        start, end = m.group(1), m.group(2)
        if start == "":                      # suffix range: last N bytes
            length = int(end or 0)
            start = max(0, size - length)
            end = size - 1
        else:
            start = int(start)
            end = int(end) if end else size - 1
        end = min(end, size - 1)

        if start > end or start >= size:
            f.close()
            self.send_response(416)
            self.send_header("Content-Range", "bytes */%d" % size)
            self.end_headers()
            return None

        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", "bytes %d-%d/%d" % (start, end, size))
        self.send_header("Content-Length", str(end - start + 1))
        self.send_header("Accept-Ranges", "bytes")
        self.end_headers()
        f.seek(start)
        return _Slice(f, end - start + 1)

    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("%s\n" % (fmt % args))


class _Slice:
    """A file-like wrapper that yields at most `remaining` bytes."""

    def __init__(self, f, remaining):
        self.f, self.remaining = f, remaining

    def read(self, n=-1):
        if self.remaining <= 0:
            return b""
        if n < 0 or n > self.remaining:
            n = self.remaining
        data = self.f.read(n)
        self.remaining -= len(data)
        return data

    def close(self):
        self.f.close()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("", port), RangeHandler) as httpd:
        print(f"41039 site on http://localhost:{port}/  (Ctrl-C to stop)")
        httpd.serve_forever()
