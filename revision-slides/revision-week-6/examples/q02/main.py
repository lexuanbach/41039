class Stock:
    def __init__(self, stock):
        self._stock = stock
    def take(self, amount):
        if amount <= 0 or amount > self._stock:
            return False
        self._stock -= amount
        return True
    def available(self):
        return self._stock

item = Stock(4)
print(item.take(3))
print(item.take(2))
print(item.available())
