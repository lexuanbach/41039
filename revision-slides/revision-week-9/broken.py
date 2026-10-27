from io import StringIO
source=StringIO("12\nbad\n7\n")
for line in source:
    total=0
    try:
        total+=int(line)
    except FileNotFoundError:
        print("Invalid")
print(total)
source.close()
