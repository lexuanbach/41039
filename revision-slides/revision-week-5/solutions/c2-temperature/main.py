class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius
    @classmethod
    def from_fahrenheit(cls, f):
        return cls((f - 32) * 5 / 9)
    def __str__(self):
        c = round(self.celsius, 1)
        return str(c) + " C"

print(Temperature(21.5))
print(Temperature.from_fahrenheit(212))
print(Temperature.from_fahrenheit(70))
