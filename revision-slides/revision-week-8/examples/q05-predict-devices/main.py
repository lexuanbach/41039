class Lamp:
    def __init__(self, room):
        self.room = room
    def status(self):
        return self.room + " lamp"

class SmartLamp(Lamp):
    def status(self):
        return super().status() + " (smart)"

class Fan:
    def status(self):
        return "fan"

for d in [Lamp("hall"), SmartLamp("bed"), Fan()]:
    print(d.status())
print(isinstance(SmartLamp("x"), Lamp),
      isinstance(Fan(), Lamp))
