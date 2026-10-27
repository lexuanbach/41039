import csv
from io import StringIO
buffer=StringIO(newline="")
writer=csv.writer(buffer,lineterminator="\n")
writer.writerow(["name","mark"])
writer.writerow(["An, Mai",85])
print(buffer.getvalue(),end="")
buffer.seek(0)
rows=list(csv.reader(buffer))
print(rows[1][0])
buffer.close()
