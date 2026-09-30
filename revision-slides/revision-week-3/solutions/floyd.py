rows = int(input("Rows: "))
limit = int(input("Limit: "))

k = 1                           # inside the outer loop, every row would restart at 1
done = False                    # no labelled break in Python: a flag carries the news out
for r in range(rows):
    for c in range(r + 1):      # range(r) gives row 1 NO numbers: r is 0 there
        if k > limit:
            done = True
            break               # ends only the inner loop...
        print(k, end=" ")
        k += 1
    if done:
        break                   # ...so the outer loop has to be told as well
    print()
