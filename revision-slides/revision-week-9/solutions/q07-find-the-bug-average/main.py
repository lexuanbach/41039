def average(path):
    try:
        f = open(path)
    except FileNotFoundError:
        print("no file:", path)
        return None
    total, count = 0, 0
    for line in f:
        if line.strip() == "":
            continue
        total += int(line)
        count += 1
    f.close()
    if count == 0:
        return None
    return total / count
with open("nums.txt", "w") as out:
    out.write("4\n6\n\n8\n")
open("empty.txt", "w").close()
print(average("nums.txt"))
print(average("empty.txt"))
print(average("missing.txt"))
