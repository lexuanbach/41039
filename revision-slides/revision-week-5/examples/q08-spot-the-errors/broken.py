class Player:
    history = []
    def __init__(name, points):
        self.name = name
        self.points = points
    def add(self, n):
        points += n
        self.history.append(n)
    def __str__(self):
        print(self.name + ": " + str(self.points))
an, binh = Player("An", 0), Player("Binh", 5)
an.add(3)
an.add(4)
print(an)
print(binh.history)
