values=[2,2,3,4,4,5]
kept=values
for value in kept:
    if value%2==0: kept.remove(value)
print(kept)
print(values)
