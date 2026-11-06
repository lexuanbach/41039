class Player:
    def __init__(self, name, points):
        self.name = name
        self.points = points
        self.history = []
    def add(self, n):
        self.points += n
        self.history.append(n)
    def __str__(self):
        return self.name + ": " + str(self.points)
p = Player("An", 0)
p.add(-50)
print(p)
print(Player("An", 0) == Player("An", 0))
p.points = 1000
print(p)
