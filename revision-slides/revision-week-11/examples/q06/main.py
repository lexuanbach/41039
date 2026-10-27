class Screen:
    def send(self, message): return "screen: "+message
class Recorder:
    def __init__(self): self.messages=[]
    def send(self, message):
        self.messages.append(message)
        return "recorded"

def notify(channel, message): return channel.send(message)
recorder=Recorder()
print(notify(recorder,"Ready"))
print(recorder.messages)
