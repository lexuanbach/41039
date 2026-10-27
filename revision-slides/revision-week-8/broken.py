class Person:
    def __init__(self,name): self.name=name
    def greet(self): return "Hello "+self.name
class Student(Person):
    def __init__(self,name): self.mark=85
    def greet(self): return super().greet+"!"

s=Student("Linh")
print(s.greet())
