class Inventory:
    def __init__(self, stock): self._stock = stock
    def take(self, amount):
        if amount <= 0 or amount > self._stock: return False
        self._stock -= amount
        return True
    def available(self): return self._stock

item = Inventory(int(input()))
n = int(input())
for _ in range(n):
    print("OK" if item.take(int(input())) else "Refused")
print(item.available())
