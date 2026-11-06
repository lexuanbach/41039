def save(path, marks):
    with open(path, "w") as f:
        f.write("name,mark\n")
        for name, mark in marks.items():
            f.write(f"{name},{mark}\n")

def total(path):
    with open(path) as f:
        lines = f.read().splitlines()
    result = 0
    for line in lines[1:]:
        result += int(line.split(",")[1])
    return result

marks = {"An": 85, "Binh": 49}
save("m.csv", marks)
save("m.csv", marks)
with open("m.csv") as f:
    print(f.read(), end="")
print(total("m.csv"))
