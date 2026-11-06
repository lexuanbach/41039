class Node:
    def __init__(self, value, link=None):
        self.value = value
        self.next = link

c = Node("C")
a = Node("A", Node("B", c))
a.next.next = Node("X", c)
a.next = a.next.next
names = []
n = a
while n is not None:
    names.append(n.value)
    n = n.next
print(names)
print(a.next.value, c.next)
