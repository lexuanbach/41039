class Basket:
    def __init__(self):
        self.items = []

a = Basket()
b = Basket()
a.items.append("tea")
print(a.items)
print(b.items)
print(a is b)
