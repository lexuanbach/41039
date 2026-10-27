from collections import deque
q=deque(["An","Mai"])
q.append("Linh")
served=q.popleft()
q.appendleft("Tea")
print(served)
print(list(q))
print(len(q))
