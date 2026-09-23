a = input("First number: ")
b = input("Second number: ")

a = int(a)                      # input() always gives a str
b = int(b)                      # forget these and a + b is "72", with no error

total = a + b
average = total / 2             # Python's / gives 4.5 here; Java's gave 4

print("Sum: " + str(total))     # without str(): TypeError, str + int
print("Average: " + str(average))
