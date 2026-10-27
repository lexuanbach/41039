class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return self.name + " is quiet"

class Dog(Animal):
    def speak(self):
        return super().speak() + "; then woof"

print(Dog("Milo").speak())
