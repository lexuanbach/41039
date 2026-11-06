class Playlist:
    def __init__(self):
        pass  # TODO
    def add(self, song):
        # TODO
        return False
    def __str__(self):
        # TODO
        return "0 songs"

a = Playlist()
b = Playlist()
print(a.add("Hello"), a.add("Hello"))
print(a.add(""))
a.add("Yesterday")
print(a)
print(b)
