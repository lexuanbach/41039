def parse(line):
    name,text=line.split(",")
    mark=int(text)
    if not 0<=mark<=100:
        raise ValueError("range")
    return name,mark

records=[]
for line in ["Linh,85","An,bad","Mai,50"]:
    try: records.append(parse(line))
    except ValueError: print("Invalid")
print(sum(mark>=50 for name,mark in records))
