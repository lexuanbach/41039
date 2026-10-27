lines=["A,50","broken","C,101"]
marks=[]
for line in lines:
    try:
        parts=line.split(",")
        if len(parts)!=2 or not parts[0]: raise ValueError("fields")
        mark=int(parts[1])
        if not 0<=mark<=100: raise ValueError("range")
        marks.append(mark)
    except ValueError:
        print("Invalid")
print("count,total,passed")
print(f"{len(marks)},{sum(marks)},{sum(m>=50 for m in marks)}")
