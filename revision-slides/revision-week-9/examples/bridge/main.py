# Looking ahead, Python side: write() adds no newline of its own.
with open("report.txt", "w", encoding="utf-8") as f:
    f.write("marks,2")
    f.write("total,155\n")
with open("report.txt", encoding="utf-8") as f:
    print(f.readlines())
