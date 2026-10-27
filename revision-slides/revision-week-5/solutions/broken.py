class Account:
    def __init__(self, cents):
        self.cents=cents
        self.deposits=[]
    def deposit(self, amount):
        self.deposits.append(amount)
        self.cents+=amount
    def __str__(self): return str(self.cents)

a=Account(100)
b=Account(200)
a.deposit(50)
print(a.cents,b.cents)
print(b.deposits)
print(a)
