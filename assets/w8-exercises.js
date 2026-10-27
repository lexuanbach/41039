/* Output expectations verified by scripts/check_week_content.py. */
window.WEEK_EXERCISES = [
  {
    "id": "e1",
    "title": "Polymorphic areas in Java",
    "lang": "java",
    "brief": "Read one line: <code>S side</code> or <code>R width height</code>, using positive integer dimensions. Implement a Shape interface and concrete Square and Rectangle classes. Print the integer area.",
    "starter": "import java.util.Scanner;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        // create a Shape from S or R and print area()\n    }\n}\n",
    "solution": "import java.util.Scanner;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        String kind=sc.next();\n        Shape shape;\n        if(kind.equals(\"S\")) shape=new Square(sc.nextInt());\n        else shape=new Rectangle(sc.nextInt(),sc.nextInt());\n        System.out.println(shape.area());\n    }\n}\ninterface Shape { int area(); }\nclass Square implements Shape {\n    private final int s;\n    Square(int s) { this.s=s; }\n    public int area() { return s*s; }\n}\nclass Rectangle implements Shape {\n    private final int w,h;\n    Rectangle(int w,int h) { this.w=w; this.h=h; }\n    public int area() { return w*h; }\n}\n",
    "tests": [
      {
        "stdin": "S 3\n",
        "expect": "9\n"
      },
      {
        "stdin": "R 2 4\n",
        "expect": "8\n"
      },
      {
        "stdin": "S 1\n",
        "expect": "1\n"
      }
    ]
  },
  {
    "id": "e2",
    "title": "Polymorphic areas in Python",
    "lang": "python",
    "brief": "Use the same input and output as exercise 1. Put area on two subclasses and call it through one shape variable.",
    "starter": "parts=input().split()\n# define the classes, select a shape, print its area\n",
    "solution": "class Shape:\n    def area(self): raise NotImplementedError\nclass Square(Shape):\n    def __init__(self,s): self.s=s\n    def area(self): return self.s*self.s\nclass Rectangle(Shape):\n    def __init__(self,w,h): self.w,self.h=w,h\n    def area(self): return self.w*self.h\n\nparts=input().split()\nshape=Square(int(parts[1])) if parts[0]==\"S\" else Rectangle(int(parts[1]),int(parts[2]))\nprint(shape.area())\n",
    "tests": [
      {
        "stdin": "S 3\n",
        "expect": "9\n"
      },
      {
        "stdin": "R 2 4\n",
        "expect": "8\n"
      },
      {
        "stdin": "R 1 8\n",
        "expect": "8\n"
      }
    ]
  },
  {
    "id": "e3",
    "title": "Extend a constructor",
    "lang": "java",
    "brief": "Read a name on one line and a non-negative integer mark on the next. Student extends Person; initialise the name through super(name). Print <code>name: mark</code>.",
    "starter": "import java.util.Scanner;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        String name=sc.nextLine(); int mark=Integer.parseInt(sc.nextLine());\n        // construct Student and print its description\n    }\n}\n",
    "solution": "import java.util.Scanner;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        Student s=new Student(sc.nextLine(),Integer.parseInt(sc.nextLine()));\n        System.out.println(s.describe());\n    }\n}\nclass Person {\n    protected final String name;\n    Person(String name) { this.name=name; }\n}\nclass Student extends Person {\n    private final int mark;\n    Student(String name,int mark) { super(name); this.mark=mark; }\n    String describe() { return name+\": \"+mark; }\n}\n",
    "tests": [
      {
        "stdin": "Linh\n85\n",
        "expect": "Linh: 85\n"
      },
      {
        "stdin": "An Mai\n0\n",
        "expect": "An Mai: 0\n"
      },
      {
        "stdin": "Tea\n50\n",
        "expect": "Tea: 50\n"
      }
    ]
  },
  {
    "id": "e4",
    "title": "Specialise a greeting",
    "lang": "python",
    "brief": "Read a name. Parent.greet returns <code>Hello NAME</code>. Child overrides it by calling super().greet() and adding <code>!</code>. Print the child greeting.",
    "starter": "class Parent:\n    def __init__(self,name): self.name=name\n    def greet(self): return \"Hello \" + self.name\nclass Child(Parent):\n    # override greet using super\n    pass\n\n# read a name and print greeting\n",
    "solution": "class Parent:\n    def __init__(self,name): self.name=name\n    def greet(self): return \"Hello \"+self.name\nclass Child(Parent):\n    def greet(self): return super().greet()+\"!\"\nprint(Child(input()).greet())\n",
    "tests": [
      {
        "stdin": "An\n",
        "expect": "Hello An!\n"
      },
      {
        "stdin": "Linh Mai\n",
        "expect": "Hello Linh Mai!\n"
      },
      {
        "stdin": "A\n",
        "expect": "Hello A!\n"
      }
    ]
  },
  {
    "id": "e5",
    "title": "One pricing interface",
    "lang": "java",
    "brief": "Read <code>R amount</code> or <code>D amount</code>, where amount is a non-negative integer in cents. Regular returns amount; Discount returns amount \u00d7 80 / 100 using integer division. Implement both behind a Price interface and print the result.",
    "starter": "import java.util.Scanner;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        String kind=sc.next(); int amount=sc.nextInt();\n        // choose a Price implementation and print cents()\n    }\n}\n",
    "solution": "import java.util.Scanner;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        String kind=sc.next(); int amount=sc.nextInt();\n        Price p=kind.equals(\"R\") ? new Regular(amount) : new Discount(amount);\n        System.out.println(p.cents());\n    }\n}\ninterface Price { int cents(); }\nclass Regular implements Price {\n    private final int amount;\n    Regular(int amount) { this.amount=amount; }\n    public int cents() { return amount; }\n}\nclass Discount implements Price {\n    private final int amount;\n    Discount(int amount) { this.amount=amount; }\n    public int cents() { return amount*80/100; }\n}\n",
    "tests": [
      {
        "stdin": "R 125\n",
        "expect": "125\n"
      },
      {
        "stdin": "D 125\n",
        "expect": "100\n"
      },
      {
        "stdin": "D 1\n",
        "expect": "0\n"
      },
      {
        "stdin": "D 0\n",
        "expect": "0\n"
      }
    ]
  },
  {
    "id": "e6",
    "title": "Two duck-typed delivery channels",
    "lang": "python",
    "brief": "Read <code>email</code> or <code>screen</code> on the first line, then a message. Define Email and Screen with send(text) and one notify function that uses send. Print <code>email: MESSAGE</code> or <code>screen: MESSAGE</code>.",
    "starter": "class Email:\n    pass\nclass Screen:\n    pass\n# implement send and notify\n",
    "solution": "class Email:\n    def send(self,text): return \"email: \"+text\nclass Screen:\n    def send(self,text): return \"screen: \"+text\ndef notify(channel,text): print(channel.send(text))\nkind=input()\nnotify(Email() if kind==\"email\" else Screen(),input())\n",
    "tests": [
      {
        "stdin": "email\nHello\n",
        "expect": "email: Hello\n"
      },
      {
        "stdin": "screen\nDue soon\n",
        "expect": "screen: Due soon\n"
      },
      {
        "stdin": "email\n\n",
        "expect": "email: \n"
      }
    ]
  }
];
