/* Newly authored practice, adapted from Ed and Canvas topics. */
window.WEEK_DATA = {
  "id": "week-8",
  "quiz": [
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "public class Demo {\n    public static void main(String[] args) {\n        Animal pet = new Dog(\"Milo\");\n        System.out.println(pet.speak());\n    }\n}\nclass Animal {\n    protected final String name;\n    Animal(String name) { this.name=name; }\n    String speak() { return name+\" is quiet\"; }\n}\nclass Dog extends Animal {\n    Dog(String name) { super(name); }\n    @Override String speak() { return name+\" says woof\"; }\n}\n",
      "lang": "java",
      "opts": [
        "<code>Milo says woof</code>",
        "<code>Milo is quiet</code>",
        "<code>Animal says woof</code>",
        "<code>null says woof</code>"
      ],
      "a": 0,
      "why": "The variable type permits speak, while the object type selects Dog.speak at runtime."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return self.name + \" is quiet\"\n\nclass Dog(Animal):\n    def speak(self):\n        return super().speak() + \"; then woof\"\n\nprint(Dog(\"Milo\").speak())\n",
      "lang": "python",
      "opts": [
        "<code>Milo says woof</code>",
        "<code>Milo is quiet; then woof</code>",
        "<code>Dog is quiet; then woof</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 1,
      "why": "Dog extends the behaviour by calling the inherited implementation first."
    },
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "public class Demo {\n    public static void main(String[] args) {\n        Parent value = new Child();\n        System.out.println(value.label);\n        System.out.println(value.describe());\n    }\n}\nclass Parent {\n    String label=\"parent field\";\n    String describe() { return \"parent method\"; }\n}\nclass Child extends Parent {\n    String label=\"child field\";\n    @Override String describe() { return \"child method\"; }\n}\n",
      "lang": "java",
      "opts": [
        "<code>child field<br>child method</code>",
        "<code>parent field<br>parent method</code>",
        "<code>parent field<br>child method</code>",
        "<code>child field<br>parent method</code>"
      ],
      "a": 2,
      "why": "The field name is selected from Parent, but the overridden instance method comes from Child."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self):\n        pass\n\nclass Square(Shape):\n    def __init__(self, side):\n        self.side = side\n    def area(self):\n        return self.side * self.side\n\nshape = Square(3)\nprint(shape.area())\nprint(isinstance(shape, Shape))\n",
      "lang": "python",
      "opts": [
        "<code>3<br>True</code>",
        "<code>9<br>False</code>",
        "<code>0<br>True</code>",
        "<code>9<br>True</code>"
      ],
      "a": 3,
      "why": "Square implements area and is a subtype of Shape; the area is 3\u00d73."
    },
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "public class Demo {\n    public static void main(String[] args) {\n        Shape[] shapes = {new Square(3), new Rectangle(2,4)};\n        for(Shape shape:shapes) System.out.println(shape.area());\n    }\n}\ninterface Shape { int area(); }\nclass Square implements Shape {\n    private final int side;\n    Square(int side) { this.side=side; }\n    public int area() { return side*side; }\n}\nclass Rectangle implements Shape {\n    private final int w,h;\n    Rectangle(int w,int h) { this.w=w; this.h=h; }\n    public int area() { return w*h; }\n}\n",
      "lang": "java",
      "opts": [
        "<code>9<br>8</code>",
        "<code>8<br>9</code>",
        "<code>3<br>6</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 0,
      "why": "Square computes 9, Rectangle computes 8, and the caller needs only the common interface."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "class Email:\n    def send(self, text):\n        return \"email: \" + text\n\nclass Screen:\n    def send(self, text):\n        return \"screen: \" + text\n\ndef notify(channel):\n    print(channel.send(\"Hello\"))\n\nnotify(Email())\nnotify(Screen())\n",
      "lang": "python",
      "opts": [
        "<code>email: Hello<br>email: Hello</code>",
        "<code>email: Hello<br>screen: Hello</code>",
        "<code>screen: Hello<br>email: Hello</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 1,
      "why": "Each object implements send; Python calls the method available on the received object."
    },
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "public class Demo {\n    public static void main(String[] args) {\n        Notice notice=new Notice(new Screen());\n        notice.show(\"Due soon\");\n    }\n}\ninterface Channel { void send(String message); }\nclass Screen implements Channel {\n    public void send(String message) { System.out.println(\"screen: \"+message); }\n}\nclass Notice {\n    private final Channel channel;\n    Notice(Channel channel) { this.channel=channel; }\n    void show(String text) { channel.send(text); }\n}\n",
      "lang": "java",
      "opts": [
        "<code>Due soon</code>",
        "<code>screen: null</code>",
        "<code>screen: Due soon</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 2,
      "why": "Notice owns the decision to show a message; its Channel owns delivery."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "class A:\n    def label(self): return \"A\"\nclass B:\n    def label(self): return \"B\"\nclass C(A, B):\n    pass\n\nprint(C().label())\nprint([cls.__name__ for cls in C.__mro__])\n",
      "lang": "python",
      "opts": [
        "<code>B<br>[&#x27;C&#x27;, &#x27;B&#x27;, &#x27;A&#x27;, &#x27;object&#x27;]</code>",
        "<code>A<br>[&#x27;A&#x27;, &#x27;B&#x27;, &#x27;C&#x27;, &#x27;object&#x27;]</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced.",
        "<code>A<br>[&#x27;C&#x27;, &#x27;A&#x27;, &#x27;B&#x27;, &#x27;object&#x27;]</code>"
      ],
      "a": 3,
      "why": "C has no label method; Python next finds it on A. More complicated hierarchies follow the full C3 method resolution order."
    },
    {
      "q": "What does the declared type of a Java reference determine?",
      "opts": [
        "Which members are available to the compiler.",
        "Which overridden instance method must run, regardless of the actual object type.",
        "Which constructor must be rerun every time an inherited method is called.",
        "Which private fields become public when an object is assigned to a superclass variable."
      ],
      "a": 0,
      "why": "The compiler checks accessible members using the declared type; dynamic dispatch then selects an overridden instance method."
    },
    {
      "q": "Why is @Override useful?",
      "opts": [
        "It changes every method into a static method shared by all subclass instances.",
        "It asks the compiler to check that a method really overrides another.",
        "It makes a private superclass field directly accessible in all unrelated classes.",
        "It guarantees that the method satisfies every behavioural promise of its superclass."
      ],
      "a": 1,
      "why": "The annotation catches signature mistakes, not semantic contract violations."
    },
    {
      "q": "Which statement about Java interfaces is accurate?",
      "opts": [
        "A class can extend any number of ordinary concrete superclasses in Java.",
        "An interface can have a constructor that callers use with new InterfaceName().",
        "A class can implement more than one interface.",
        "An interface can store a separate mutable instance field for every implementing object."
      ],
      "a": 2,
      "why": "Multiple interfaces are allowed; multiple class inheritance is not."
    },
    {
      "q": "When is composition a good fit?",
      "opts": [
        "Whenever two classes have the same first letter, even if their responsibilities differ.",
        "Whenever you want a subclass to violate the input contract promised by its parent.",
        "Whenever you need private fields of an unrelated class to become publicly writable.",
        "When an object uses a collaborator whose behaviour may vary."
      ],
      "a": 3,
      "why": "A has-a relationship is a useful way to delegate behaviour while preserving a narrow interface."
    }
  ]
};
