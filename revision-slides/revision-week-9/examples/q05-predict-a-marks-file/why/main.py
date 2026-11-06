# Q5 part 2: what goes wrong on line 2 and on line 3, and does a final "\n" add a line?
for line in ["\n", "An,abc\n"]:
    try:
        name, mark = line.strip().split(",")
        int(mark)
    except ValueError as e:
        print(repr(line.strip().split(",")), "->", e)

with open("a.txt", "w", encoding="utf-8") as f:
    f.write("Linh,85\n\nAn,abc\nMai,70\n")
with open("a.txt", encoding="utf-8") as f:
    print(len(f.readlines()), "lines with a final newline")
