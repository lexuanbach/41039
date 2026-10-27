class A:
    def label(self): return "A"
class B(A):
    def label(self): return super().label()+"B"
class C(B):
    def label(self): return super().label()+"C"

print(C().label())
print(isinstance(C(),A))
