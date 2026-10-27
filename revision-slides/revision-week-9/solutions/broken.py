from io import StringIO
total=0
with StringIO("12\nbad\n7\n") as source:
    for line in source:
        try:
            total+=int(line)
        except ValueError:
            print("Invalid")
print(total)
