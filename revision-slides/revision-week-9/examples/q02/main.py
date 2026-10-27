for text in ["12", "bad", "7"]:
    try:
        value = int(text)
    except ValueError:
        print("Invalid:", text)
    else:
        print(value + 1)
