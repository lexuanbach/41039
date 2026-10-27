def mark(text):
    value = int(text)
    if not 0 <= value <= 100:
        raise ValueError("mark out of range")
    return value

try:
    print(mark("120"))
except ValueError as error:
    print(error)
finally:
    print("checked")
