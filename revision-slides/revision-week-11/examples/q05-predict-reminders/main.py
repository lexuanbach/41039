class Screen:
    def send(self, text):
        print("screen:", text)

class Recorder:
    def __init__(self):
        self.sent = []
    def send(self, text):
        self.sent.append(text)

def remind(channel, names):
    for name in names:
        if name != "":
            channel.send("Due: " + name)

remind(Screen(), ["An", ""])
r = Recorder()
remind(r, ["Binh", "Chi"])
print(len(r.sent), r.sent[0])
