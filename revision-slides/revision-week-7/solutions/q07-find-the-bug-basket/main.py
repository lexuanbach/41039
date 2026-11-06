class Basket:
    def __init__(self, items):
        self.items = list(items)
    def take_out(self, item):
        if item in self.items:
            self.items.remove(item)
    def remove_all(self, item):
        self.items = [t for t in self.items if t != item]

shop = ["egg", "milk", "milk", "tea"]
b = Basket(shop)
b.remove_all("milk")
print(b.items)
b.take_out("egg")
print(b.items, shop)
