class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next
def show(head):
    out = []
    while head is not None:
        out.append(head.value)
        head = head.next
    return out
def push_front(head, value):
    return Node(value, head)
def remove_after(node):
    if node.next is not None:
        node.next = node.next.next
h = Node("b", Node("c"))
push_front(h, "z")
h = push_front(h, "a")
remove_after(h.next)
print(show(h))
print(h.value, h.next.next)
