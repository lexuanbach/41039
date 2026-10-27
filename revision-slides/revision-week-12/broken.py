lines=["A,50","broken","C,101"]
marks=[]
for line in lines:
    parts=line.split(",")
    try:
        marks.append(int(parts[1]))
    except ValueError:
        print("Invalid")
print("count,total,passed")
print(f"{len(lines)},{sum(marks)},{sum(m>50 for m in marks)}")
