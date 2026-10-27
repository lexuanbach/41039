class Basket:
    items = []

a = Basket()
b = Basket()
a.items.append("tea")
print(b.items)
print(a.items is b.items)
