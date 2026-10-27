class BankAccount:
    # __init__, deposit, withdraw and balance go here
    pass

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
