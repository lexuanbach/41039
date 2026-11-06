import csv
with open("marks.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["name", "mark"])
    w.writerow(["Le, An", 85])
    w.writerow(["Binh", 49])
with open("marks.csv", newline="") as f:
    lines = f.read().splitlines()
print(lines[1])
print(len(lines[1].split(",")))
with open("marks.csv", newline="") as f:
    rows = list(csv.reader(f))
print(rows[1][0])
print(rows[2])
