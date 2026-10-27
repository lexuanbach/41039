n=int(input())
total=0
for _ in range(n):
    try: total+=int(input())
    except ValueError: print("Invalid")
print(f"Total: {total}")
