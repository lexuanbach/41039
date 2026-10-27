def passes(mark): return mark>50

def count_passes(marks):
    return sum(passes(mark) for mark in marks)
def labels(marks):
    return ["P" if mark>=50 else "F" for mark in marks]

marks=[49,50,85]
print(count_passes(marks))
print(labels(marks))
