class BankAccount:

    def __init__(self, starting):
        self.__balance = starting

    def deposit(self, cents):
        if cents <= 0:
            return False
        self.__balance += cents
        return True

    def withdraw(self, cents):
        if cents <= 0 or cents > self.__balance:
            return False
        self.__balance -= cents
        return True

    def balance(self):
        return self.__balance

acc = BankAccount(int(input()))
line = input()
while line != "Q":
    parts = line.split()
    amount = int(parts[1])
    if parts[0] == "D":
        ok = acc.deposit(amount)
    else:
        ok = acc.withdraw(amount)
    if ok:
        print("OK")
    else:
        print("Refused")
    line = input()
print("Balance: " + str(acc.balance()))
