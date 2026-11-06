class Node:
    def __init__(self, value):
        self.value, self.next = value, None
class Chain:
    def __init__(self):
        self.head = None
    def add_last(self, value):
        node = Node(value)
        if self.head is None:
            self.head = node
            return
        cur = self.head
        while cur is not None:
            cur = cur.next
        cur.next = node
    def remove(self, value):
        prev, cur = None, self.head
        while cur is not None and cur.value != value:
            prev, cur = cur, cur.next
        if cur is not None:
            prev.next = cur
    def values(self):
        out, cur = [], self.head
        while cur is not None:
            out.append(cur.value)
            cur = cur.next
        return out

c = Chain()
for v in ["a", "b", "c", "d"]:
    c.add_last(v)
c.remove("c")
c.remove("a")
c.remove("z")
print(c.values())
