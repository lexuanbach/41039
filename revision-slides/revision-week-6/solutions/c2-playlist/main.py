class Playlist:
    def __init__(self):
        self._songs = []
    def add(self, song):
        if song == "" or song in self._songs:
            return False
        self._songs.append(song)
        return True
    def __str__(self):
        text = str(len(self._songs)) + " songs"
        if self._songs:
            text += ": " + ", ".join(self._songs)
        return text

a = Playlist()
b = Playlist()
print(a.add("Hello"), a.add("Hello"))
print(a.add(""))
a.add("Yesterday")
print(a)
print(b)
