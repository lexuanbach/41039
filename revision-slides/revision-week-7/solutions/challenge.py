n=int(input())
values=list(map(int,input().split()))
result=[]
for x in values[:n]:
    if x not in result: result.append(x)
print(*result)
