class Team:
    def __init__(self, name, size):
        self.name = name
        self.size = size
        self.members = []
    def join(self, person):
        if len(self.members) >= self.size:
            return False
        self.members.append(person)
        return True
    def leave(self, person):
        if person not in self.members:
            return False
        self.members.remove(person)
        return True

red = Team("red", 2)
blue = Team("blue", 3)
print(red.join("An"), red.join("Binh"),
      red.join("Chi"))
print(red.members, blue.members)
print(red.leave("Dung"))
