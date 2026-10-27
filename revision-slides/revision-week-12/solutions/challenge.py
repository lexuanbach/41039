class Student:
    def __init__(self,name,mark): self.name,self.mark=name,mark
    def passed(self): return self.mark>=50

def parse(line):
    parts=line.split(",")
    if len(parts)!=2 or not parts[0]: raise ValueError("record")
    mark=int(parts[1])
    if not 0<=mark<=100: raise ValueError("range")
    return Student(parts[0],mark)

n=int(input())
records=[]
for _ in range(n):
    try: records.append(parse(input()))
    except ValueError: print("Invalid")
print("count,total,passed")
print(f"{len(records)},{sum(s.mark for s in records)},{sum(s.passed() for s in records)}")
