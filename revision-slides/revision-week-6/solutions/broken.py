class Basket:
    def __init__(self): self.items=[]
    def copy(self):
        other=Basket()
        other.items=self.items[:]
        return other
    def add(self,name): self.items.append(name)
    def count(self): return len(self.items)

a=Basket()
a.add("tea")
b=a.copy()
b.add("milk")
print(a.items,b.items)
print(a.count())
