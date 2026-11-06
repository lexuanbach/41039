class Basket:
    def __init__(self, items):
        self.items = items
    def take_out(self, item):
        if item in self.items:
            self.items.pop(item)
    def remove_all(self, item):
        for thing in self.items:
            if thing == item:
                self.items.remove(thing)

shop = ["egg", "milk", "milk", "tea"]
b = Basket(shop)
b.remove_all("milk")
print(b.items)
b.take_out("egg")
print(b.items, shop)
