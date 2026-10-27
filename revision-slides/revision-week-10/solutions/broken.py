from pathlib import Path
from tempfile import TemporaryDirectory
with TemporaryDirectory() as folder:
    path=Path(folder)/"report.txt"
    path.write_text("old\n",encoding="utf-8")
    with path.open("a",encoding="utf-8") as out:
        out.write("new\n")
    with path.open("r",encoding="utf-8") as source:
        print(source.read(),end="")
