rows = ["An,50", "Binh,70",
        "Chi,abc", "Dung,90"]

def report(lines):
    total = 0
    for line in lines:
        name, mark = line.split(",")
        total += int(mark)
    print("Average:", total / len(lines))

report(rows)
