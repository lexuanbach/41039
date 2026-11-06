def ask_number(low, high):
    while True:
        try:
            text = input()
        except EOFError:
            return None
        try:
            n = int(text)
        except ValueError:
            print("not a number:", text)
            continue
        if low <= n <= high:
            return n
        print("out of range:", n)

# input: abc, 42, 7, x (one per line), then the input ends
print(ask_number(1, 10))
print(ask_number(1, 10))
