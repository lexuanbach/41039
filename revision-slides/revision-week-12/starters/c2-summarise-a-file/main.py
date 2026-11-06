def summarise(path):
    count, passed = 0, 0
    with open(path) as f:
        for line in f:
            line = line.strip()
            # TODO
    return count, passed

with open("marks.txt", "w") as f:
    f.write("Linh,85\n\nAn,abc\nMai,50\nChi,7.5\nBinh,49")
print(summarise("marks.txt"))
