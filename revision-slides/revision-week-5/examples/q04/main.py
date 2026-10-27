class Foo:
    baz = "blue"

    @classmethod
    def bar(cls):
        print("The class says " + cls.baz)

Foo.bar()
