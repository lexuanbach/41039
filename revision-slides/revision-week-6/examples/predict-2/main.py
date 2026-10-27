class Basket:
    items=[]

a,b=Basket(),Basket()
a.items.append("tea")
b.items=["coffee"]
a.items.append("milk")
print(a.items)
print(b.items)
print(Basket.items)
