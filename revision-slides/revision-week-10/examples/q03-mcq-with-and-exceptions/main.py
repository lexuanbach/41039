try:
    with open("r.txt", "w") as f:
        f.write("a\n")
        n = int("two")
        f.write("b\n")
except ValueError:
    print("closed?", f.closed)
with open("r.txt") as f:
    print(repr(f.read()))
