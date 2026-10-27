class Ticket:
    issued=0
    def __init__(self):
        Ticket.issued+=1
        self.number=Ticket.issued

a,b=Ticket(),Ticket()
c=a
c.number=9
print(a.number,b.number,Ticket.issued)
print(a is c,a is b)
