n=int(input())
marks=list(map(int,input().split()))[:n]
print("count,total,passed")
print(f"{n},{sum(marks)},{sum(mark>=50 for mark in marks)}")
