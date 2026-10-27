class Order:
    def __init__(self, amounts): self.amounts=list(amounts)
    def total(self): return sum(self.amounts)

def format_receipt(order):
    return f"Total: {order.total()} cents"

order=Order([600,150])
print(order.total())
print(format_receipt(order))
