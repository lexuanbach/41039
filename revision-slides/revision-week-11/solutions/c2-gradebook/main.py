class Gradebook:
    def __init__(self, pass_mark):
        self._pass_mark = pass_mark
        self._marks = []
    def add(self, mark):
        self._marks.append(mark)
    def passes(self, mark):
        return mark >= self._pass_mark
    def count_passes(self):
        n = 0
        for m in self._marks:
            if self.passes(m):
                n += 1
        return n
    def count_fails(self):
        return len(self._marks) - self.count_passes()

g = Gradebook(50)
for m in [49, 50, 85]:
    g.add(m)
print(g.count_passes(), g.count_fails())
h = Gradebook(60)
h.add(50)
print(h.count_passes(), h.count_fails())
