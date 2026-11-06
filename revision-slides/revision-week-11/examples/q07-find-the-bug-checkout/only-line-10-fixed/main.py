def regular(cents):
    return cents
def student(cents):
    return cents * 80 // 100

class Checkout:
    def __init__(self, rule):
        self.rule = regular
    def charge(self, cents):
        return self.rule(cents)
    def receipt(self, cents):
        return "Paid: " + self.charge(cents)

c = Checkout(student)
print(c.receipt(1000))
print(c.receipt(505))
