class Shape:
    def area(self): raise NotImplementedError
class Square(Shape):
    def __init__(self,s): self.s=s
    def area(self): return self.s*self.s
class Rectangle(Shape):
    def __init__(self,w,h): self.w,self.h=w,h
    def area(self): return self.w*self.h

parts=input().split()
shape=Square(int(parts[1])) if parts[0]=="S" else Rectangle(int(parts[1]),int(parts[2]))
print(shape.area())
