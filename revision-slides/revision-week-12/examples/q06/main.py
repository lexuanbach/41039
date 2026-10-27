marks=[49,50,85]
total=0
for position,mark in enumerate(marks):
    before=total
    total+=mark
    print(position,before,total)
print("total",total)
