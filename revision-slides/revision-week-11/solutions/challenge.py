class Line:
    def __init__(self,price,quantity): self.price,self.quantity=price,quantity
    def subtotal(self): return self.price*self.quantity
class Order:
    def __init__(self): self.lines=[]
    def add(self,line): self.lines.append(line)
    def total(self): return sum(line.subtotal() for line in self.lines)

order=Order()
n=int(input())
for _ in range(n):
    price,quantity=map(int,input().split())
    order.add(Line(price,quantity))
print(order.total())
