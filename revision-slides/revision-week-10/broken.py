from pathlib import Path
from tempfile import TemporaryDirectory
with TemporaryDirectory() as folder:
    path=Path(folder)/"report.txt"
    path.write_text("old\n",encoding="utf-8")
    with path.open("w",encoding="utf-8") as out:
        out.write("new")
    with path.open("r",encoding="utf-8") as source:
        print(source.read(),end="")
