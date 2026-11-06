from collections import deque

class HelpDesk:
    def __init__(self):
        self.waiting = deque()
    def join(self, name):
        self.waiting.append(name)
        return len(self.waiting)
    def serve(self):
        if len(self.waiting) == 0:
            return None
        return self.waiting.popleft()
    def size(self):
        return len(self.waiting)

q = HelpDesk()
print(q.join("An"), q.join("Binh"), q.join("Chi"))
print(q.serve(), q.serve())
print(q.join("Dung"), q.size())
print(q.serve(), q.serve(), q.serve())
