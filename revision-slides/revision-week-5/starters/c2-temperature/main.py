class Temperature:
    def __init__(self, celsius):
        pass  # TODO: keep celsius
    @classmethod
    def from_fahrenheit(cls, f):
        pass  # TODO: a new Temperature
    def __str__(self):
        return "?"  # TODO: like "21.5 C"

print(Temperature(21.5))
print(Temperature.from_fahrenheit(212))
print(Temperature.from_fahrenheit(70))
