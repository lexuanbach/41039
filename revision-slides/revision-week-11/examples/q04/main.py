def student_price(cents): return cents*80//100
def regular_price(cents): return cents

class Basket:
    def __init__(self, rule): self.rule=rule
    def price(self, cents): return self.rule(cents)

print(Basket(student_price).price(1000))
print(Basket(regular_price).price(1000))
