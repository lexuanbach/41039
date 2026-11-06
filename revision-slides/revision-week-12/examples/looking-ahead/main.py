marks = [49, 50, 120, 85, -3]
# Optional enrichment: a list comprehension, the same filter as a loop
passing = [m for m in marks if 50 <= m <= 100]
print(passing)
print(marks)
