from io import StringIO

with StringIO("tea\n\ncoffee\n") as source:
    for line_number, line in enumerate(source, 1):
        print(f"{line_number}: {line.rstrip(chr(10))}")
