class Cup:
    size = "M"
    count = 0
    def __init__(self, drink):
        self.drink = drink
        Cup.count += 1
    def label(self):
        return self.size + " " + self.drink
    @classmethod
    def made(cls): return cls.count
    @staticmethod
    def price(size):
        return {"S": 3, "M": 4, "L": 5}[size]
a = Cup("tea")
b = Cup("coffee")
b.size = "L"
print(a.label(), b.label())
print(Cup.made(), Cup.size)
print(Cup.price(b.size))
