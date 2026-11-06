class Account:
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance
    def withdraw(self, amount):
        if amount > self.balance:
            return False
        self.balance -= amount
        return True

class FeeAccount(Account):
    def __init__(self, owner, balance, fee):
        super().__init__(owner, balance)
        self.fee = fee
    def withdraw(self, amount):
        total = amount + self.fee
        return super().withdraw(total)

a = Account("An", 10)
f = FeeAccount("Binh", 10, 2)
for acc in [a, f]:
    print(acc.owner, acc.withdraw(8), acc.balance)
print(f.withdraw(1), f.balance)
