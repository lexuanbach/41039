def parse(text):
    name,raw=text.split(",")
    mark=int(raw)
    if not 0<=mark<=100: raise ValueError("range")
    return name,mark

records=[]
for line in ["A,50","B,bad","C,85"]:
    try: records.append(parse(line))
    except ValueError: print("Invalid")
print(len(records),sum(mark for name,mark in records))
print(sum(mark>=50 for name,mark in records))
