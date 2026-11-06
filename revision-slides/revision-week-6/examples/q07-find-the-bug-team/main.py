class Team:
    members = []
    def __init__(self, name, size):
        self.name = name
        self.size = size
    def join(self, person):
        self.members.append(person)
        if len(self.members) > self.size:
            return False
        return True
    def leave(self, person):
        self.members.remove(person)
        return True

red = Team("red", 2)
blue = Team("blue", 3)
print(red.join("An"), red.join("Binh"),
      red.join("Chi"))
print(red.members, blue.members)
print(red.leave("Dung"))
