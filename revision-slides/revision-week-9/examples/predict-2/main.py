def parse(text):
    try:
        return int(text)
    finally:
        print("checked",text)

for text in ["4","x","2"]:
    try: print(parse(text))
    except ValueError: print("bad")
