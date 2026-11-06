class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary
    def pay(self):
        return self.salary
    def __str__(self):
        return self.name + ": " + str(self.pay())

class Manager(Employee):
    def __init__(self, name, salary, bonus):
        super().__init__(name, salary)
        self.bonus = bonus
    def pay(self):
        return super().pay() + self.bonus

staff = [Employee("An", 100),
         Manager("Binh", 100, 50)]
for e in staff:
    print(e)
