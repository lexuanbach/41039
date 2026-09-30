def summarise(values):
    lo = values[0]              # not 0: for [-3, -7], the largest would stay 0
    hi = values[0]
    total = 0
    for v in values:
        if v < lo:
            lo = v
        if v > hi:
            hi = v
        total += v
    mean = total / len(values)
    return (lo, hi, mean)       # return, not print: print hands back None

print(summarise([72, 55, 91, 64]))
print(summarise([5]))
print(summarise([-3, -7]))
