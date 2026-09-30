# Spot the errors: should print the sum of the odd numbers from 1 to n.
# Written by someone who learnt Java first. Five errors.
# Python shows them one at a time -- fix, run again, meet the next.
n = input("n: ")
total = 0
i = 1
while (i <= n) {
    if i % 2 == 0:
        continue
    total += i
    i++
}
print("Sum of odd numbers up to " + n
      + " is " + total)
