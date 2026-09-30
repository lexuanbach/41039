# The five errors, in the order Python makes you meet them:
#   (line numbers as on the slide and in ../marks.py)
#   L17 curved(bonus=10, marks)       SyntaxError: positional argument follows keyword argument
#   L5  average prints, never returns avg is None: can only concatenate str (not "NoneType")
#   L16 "Average is " + avg           still a TypeError once avg is a float: use a comma
#   L19 report(..., "Results")        TypeError: *names swallowed "Results"; title is keyword-only
#   L7  result = marks                NO message: result is another name for the SAME list, so
#                                    curved changes marks too. Copy it: marks[:]
def average(values):
    total = 0
    for v in values:
        total += v
    return total / len(values)

def curved(marks, bonus=5):
    # returns a NEW list, and leaves marks alone
    result = marks[:]
    for i in range(len(result)):
        result[i] += bonus
    return result

def report(*names, title):
    for n in names:
        print(title + ": " + n)

marks = [72, 55, 91]
avg = average(marks)
print("Average is", avg)
new_marks = curved(marks, bonus=10)
print(marks, new_marks)
report("Linh", "Bach", title="Results")
