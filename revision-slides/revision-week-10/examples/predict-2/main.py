import csv
from io import StringIO
text=StringIO(newline="")
writer=csv.writer(text,lineterminator="\n")
writer.writerow(["An, Mai",50])
writer.writerow(["Tea",49])
text.seek(0)
rows=list(csv.reader(text))
print(len(rows))
print(rows[0][0],int(rows[0][1])>=50)
print(rows[1])
