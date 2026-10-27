class Dog:
    tricks = []

    def __init__(self, name):
        self.name = name

    def add(self, trick):
        self.tricks.append(trick)

a = Dog("Rex")
b = Dog("Fido")
a.add("sit")
print(b.name, b.tricks)
