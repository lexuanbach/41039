class Email:
    def send(self, text):
        return "email: " + text

class Screen:
    def send(self, text):
        return "screen: " + text

def notify(channel):
    print(channel.send("Hello"))

notify(Email())
notify(Screen())
