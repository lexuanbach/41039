def average(path):
    try:
        f = open(path)
    except ValueError:
        print("no file:", path)
        return None
    total, count = 0, 0
    line = f.readline().strip()
    while line != "":
        total += int(line)
        count += 1
        line = f.readline().strip()
    f.close()
    return total / count
with open("nums.txt", "w") as out:
    out.write("4\n6\n\n8\n")
open("empty.txt", "w").close()
print(average("nums.txt"))
print(average("empty.txt"))
print(average("missing.txt"))
