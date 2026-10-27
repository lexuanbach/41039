class Recorder:
    def __init__(self): self.messages=[]
    def send(self,text):
        self.messages.append(text)
        return len(self.messages)

def notify(channel,text): return channel.send(text)
a=Recorder()
b=a
print(notify(b,"Ready"))
print(notify(a,"Go"))
print(a.messages,b.messages is a.messages)
