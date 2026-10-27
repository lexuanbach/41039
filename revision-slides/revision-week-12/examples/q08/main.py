def doubled(values):
    return [value*2 for value in values]

source=[2,3]
print(doubled(source))
print(source)
print(doubled(source)==doubled(source))
