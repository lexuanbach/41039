with open("marks.txt", "w", encoding="utf-8") as f:
    f.write("Linh,85\n\nAn,abc\nMai,70")

count = 0
total = 0
with open("marks.txt", encoding="utf-8") as f:
    for line in f:
        count += 1
        try:
            name, mark = line.strip().split(",")
            total += int(mark)
        except ValueError:
            print("line", count, "skipped")
        else:
            print(name, "ok")
print(count, total)
