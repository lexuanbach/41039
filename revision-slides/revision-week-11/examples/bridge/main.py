rows = ["An,50", "Binh,70",
        "Chi,abc", "Dung,90"]

def parse(line):      # text -> a mark, or None
    name, mark = line.split(",")
    if mark.isdigit():
        return int(mark)
    return None

marks = []
for line in rows:
    m = parse(line)
    if m is None:
        print("Skipped:", line)
    else:
        marks.append(m)
print("Average:", sum(marks) / len(marks))
