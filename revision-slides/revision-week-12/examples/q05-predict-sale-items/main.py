class Item:
    def __init__(self, name, price):
        self.name, self.price = name, price
    def cost(self, n):
        if n <= 0:
            raise ValueError("bad n")
        return self.price * n
class Sale(Item):
    def cost(self, n):
        return super().cost(n) - 1
orders = [(Item("pen", 2), 3),
          (Sale("ink", 5), 2),
          (Item("pad", 4), 0)]
total = 0
for item, n in orders:
    try:
        total += item.cost(n)
        print(item.name, total)
    except ValueError:
        print("skip", item.name)
