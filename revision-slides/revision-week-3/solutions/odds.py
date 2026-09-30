# The five errors, in the order Python makes you meet them:
#   1. { } around the block       SyntaxError -- a Python block is a colon and indentation
#   2. i++                        SyntaxError -- no ++ in Python: i += 1
#   3. input() with no int()      TypeError at the while: '<=' between int and str
#   4. continue before i += 1     NO message: at i = 2 it skips the increment forever, and hangs
#   5. "..." + n + ... + total    TypeError: can only concatenate str (not "int") to str --
#                                 there all along, but unreachable until 4 was fixed
n = int(input("n: "))
total = 0
i = 1
while i <= n:
    if i % 2 == 1:              # add the odd ones instead of skipping the even ones:
        total += i              #   no continue, so no increment to skip
    i += 1
print("Sum of odd numbers up to", n,
      "is", total)
