class Gradebook:
    def __init__(self, pass_mark):
        pass  # TODO
    def add(self, mark):
        pass  # TODO
    def passes(self, mark):
        return False  # TODO
    def count_passes(self):
        return 0  # TODO
    def count_fails(self):
        return 0  # TODO

g = Gradebook(50)
for m in [49, 50, 85]:
    g.add(m)
print(g.count_passes(), g.count_fails())
h = Gradebook(60)
h.add(50)
print(h.count_passes(), h.count_fails())
