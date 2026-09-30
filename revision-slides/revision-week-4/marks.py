def average(values):
    total = 0
    for v in values:
        total += v
    print(total / len(values))
def curved(marks, bonus=5):
    result = marks
    for i in range(len(result)):
        result[i] += bonus
    return result
def report(*names, title):
    for n in names:
        print(title + ": " + n)
marks = [72, 55, 91]
avg = average(marks)
print("Average is " + avg)
new_marks = curved(bonus=10, marks)
print(marks, new_marks)
report("Linh", "Bach", "Results")
