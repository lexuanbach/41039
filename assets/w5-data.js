/* Week 5 quiz data — 41039 Programming 1.
   Consumed by assets/course.js via window.WEEK_DATA.
   Questions come from the Week 5 lessons on Ed: OOP fundamentals, classes and objects
   in Java and Python, enums, and advanced switch.
   Every `code` snippet's behaviour was verified by actually running it: Java compiled
   with the site's own vendor/ecj.jar (snippets that need Java 14+ with javac 26 at the
   lowest release that accepts them) and run on a JVM; Python on CPython 3.14. None of
   these answers is from memory.
   Distractors are written so that at least one is longer than the correct answer, so
   answer length is never a tell — and the correct option's position varies (A–D), because
   course.js does not shuffle options, so position must not be a tell either. */
window.WEEK_DATA = {
  id: 'week-5',
  quiz: [
    {
      q: 'Two <code>BankAccount</code> classes offer exactly the same public methods, and a program switches from one to the other without changing a line. Which pillar of OOP made that possible?',
      opts: [
        'Inheritance, because the second class inherits the methods of the first one',
        'Abstraction',
        'Polymorphism, because the two classes have different shapes but the same name',
        'Encapsulation alone, since the two classes store their data in private fields'
      ],
      a: 1,
      why: 'Abstraction: the program depends only on what a <code>BankAccount</code> does, not on how it stores the balance, so implementations are interchangeable. Encapsulation (private data) is what <em>enables</em> that, but on its own it is about controlling access. Neither class inherits from the other, and ad-hoc polymorphism is about one method name with different parameter lists.'
    },
    {
      q: 'What happens when you compile this?',
      lang: 'java',
      code: 'public class Runner {\n    public static void main(String[] args) {\n        Account acc = new Account();\n        acc.balance = 1000000;\n        System.out.println("Rich!");\n    }\n}\n\nclass Account {\n    private int balance;\n}',
      opts: [
        'It compiles and prints <code>Rich!</code>, because <code>Runner</code> is in the same file',
        'It compiles, but throws an exception at run time when the private field is written',
        'It compiles and prints <code>Rich!</code>, because <code>Runner</code> is the public class',
        'It does not compile: <code>balance</code> is private to <code>Account</code>'
      ],
      a: 3,
      why: '<code>private</code> means only code inside <code>Account</code> may use the field. Sharing a file does not change that, and neither does which class is public. The compiler reports <em>The field Account.balance is not visible</em> (on Ed: <em>balance has private access in Account</em>), so nothing runs.'
    },
    {
      q: 'Section 1.4 swapped a cents-based <code>BankAccount</code> for one storing a <code>float</code>. Why did a thousand one-cent deposits into a $1,000,000 account disappear?',
      opts: [
        'Near 1,000,000 the gap between neighbouring <code>float</code>s is 0.0625, so adding 0.01 rounds back to the same value',
        'The <code>float</code> version never actually calls <code>deposit</code>, because its methods have different names',
        'A <code>float</code> cannot hold numbers larger than 1,000,000 at all, so the balance was silently cut off at exactly that value every time',
        '<code>Math.round</code> in the cents version rounds each deposit up to a whole dollar, which the float version does not'
      ],
      a: 0,
      why: 'A <code>float</code> is an IEEE 754 32-bit number with about seven significant digits. <code>Math.ulp(1000000f)</code> is 0.0625, so <code>1000000f + 0.01f == 1000000f</code>. It can hold far larger numbers than a million — just not precisely. The swap itself worked (same methods, same <code>main</code>); the new implementation was simply less correct. Hence: store money as an <code>int</code> number of cents.'
    },
    {
      q: 'What does this print?',
      lang: 'java',
      code: 'public class Counter {\n    private static int total = 0;\n    private int mine = 0;\n\n    public void click() {\n        total++;\n        mine++;\n    }\n\n    public static void main(String[] args) {\n        Counter a = new Counter();\n        Counter b = new Counter();\n        a.click();\n        a.click();\n        b.click();\n        System.out.println(a.mine + " " + b.mine + " " + total);\n    }\n}',
      opts: [
        '<code>2 1 2</code>, because <code>total</code> is copied into each object when it is created',
        '<code>3 3 3</code>, because every variable in a class is shared by all its objects',
        '<code>2 1 3</code>',
        '<code>2 1 1</code>, because a static variable is reset each time a new object is made'
      ],
      a: 2,
      why: 'A <code>static</code> field has exactly one copy, on the class, shared by every object — so all three clicks count towards <code>total</code>. <code>mine</code> is an instance variable: each object has its own, so <code>a</code> counts 2 and <code>b</code> counts 1. Static fields are never copied into objects and never reset by a constructor.'
    },
    {
      q: 'What happens when you compile this?',
      lang: 'java',
      code: 'public class Circle {\n    private double radius;\n\n    public Circle(double radius) {\n        this.radius = radius;\n    }\n\n    public static double area() {\n        return 3.14 * radius * radius;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(new Circle(2).area());\n    }\n}',
      opts: [
        'It prints <code>12.56</code>, because <code>area</code> is called on the object <code>new Circle(2)</code>',
        'It prints <code>0.0</code>, because a static method sees the default value of every field',
        'It compiles, but crashes when it is run, because no object is available to supply a radius inside <code>area</code>',
        'It does not compile: a static method cannot use the instance variable <code>radius</code>'
      ],
      a: 3,
      why: 'A static method runs on the class, with no particular object, so there is no <code>radius</code> for it to read — and calling it through an object does not change that. The compiler stops it: <em>Cannot make a static reference to the non-static field radius</em>. Remove <code>static</code> from <code>area</code> and it prints about 12.56.'
    },
    {
      q: 'What happens when you compile this?',
      lang: 'java',
      code: 'public class Runner {\n    public static void main(String[] args) {\n        Point p = new Point();\n    }\n}\n\nclass Point {\n    private int x, y;\n\n    public Point(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n}',
      opts: [
        'It does not compile: once a constructor is written, no default <code>Point()</code> is supplied',
        'It compiles, and <code>p</code> is a point with <code>x</code> and <code>y</code> both set to 0',
        'It compiles, and <code>p</code> is <code>null</code> because the constructor could not be matched',
        'It does not compile, because a class with private fields must not have a public constructor'
      ],
      a: 0,
      why: 'Java supplies a default constructor only when a class declares <em>no</em> constructors at all. <code>Point</code> declares one, taking two <code>int</code>s, so <code>new Point()</code> matches nothing: <em>The constructor Point() is undefined</em>. Declaring <code>public Point() { this(0, 0); }</code> would fix it.'
    },
    {
      q: 'What does this print?',
      lang: 'java',
      code: 'public class Box {\n    private int w, h;\n\n    public Box() {\n        this(2);\n        System.out.println("Box()");\n    }\n\n    public Box(int s) {\n        this(s, s);\n        System.out.println("Box(int)");\n    }\n\n    public Box(int w, int h) {\n        this.w = w;\n        this.h = h;\n        System.out.println("Box(int, int)");\n    }\n\n    public static void main(String[] args) {\n        Box b = new Box();\n        System.out.println(b.w * b.h);\n    }\n}',
      opts: [
        '<code>Box()</code>, <code>Box(int)</code>, <code>Box(int, int)</code>, then <code>4</code>',
        'Just <code>Box()</code> and then <code>0</code>, because only the constructor that was called runs',
        '<code>Box(int, int)</code>, <code>Box(int)</code>, <code>Box()</code>, then <code>4</code>',
        'It does not compile, because <code>this(...)</code> may only be used from the constructor with most parameters'
      ],
      a: 2,
      why: '<code>this(...)</code> must be the first line, and it runs the other constructor <em>to completion</em> before the rest of the calling one continues. So <code>Box()</code> calls <code>Box(2)</code>, which calls <code>Box(2, 2)</code>; the innermost prints first and the prints unwind outwards. The fields end up 2 and 2, so the area is 4.'
    },
    {
      q: 'What does this print?',
      lang: 'java',
      code: 'public class P {\n    private int x;\n\n    public P(int x) {\n        x = x;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(new P(5).x);\n    }\n}',
      opts: [
        '<code>5</code>, because the constructor copies its parameter into the field',
        '<code>0</code>',
        'It does not compile, because a parameter may not have the same name as a field',
        'It does not compile, because the variable <code>x</code> is assigned to itself'
      ],
      a: 1,
      why: 'Inside the constructor, <code>x</code> means the <em>parameter</em>, which hides the field of the same name. So <code>x = x</code> copies the parameter onto itself, and the field keeps its default value, 0. It is legal (at most a compiler warning), which is exactly what makes it a nasty bug. <code>this.x = x;</code> is the fix — the first use of <code>this</code> in section 4.3.'
    },
    {
      q: 'What does this print?',
      lang: 'java',
      code: 'public class Runner {\n    public static void main(String[] args) {\n        Account a = new Account(100);\n        Account b = a;\n        b.deposit(50);\n        System.out.println(a.getBalance() + " " + (a == b));\n    }\n}\n\nclass Account {\n    private int balance;\n    public Account(int b) { balance = b; }\n    public void deposit(int amount) { balance += amount; }\n    public int getBalance() { return balance; }\n}',
      opts: [
        '<code>150 true</code>',
        '<code>100 true</code>, because the deposit went into <code>b</code>&rsquo;s own copy of the account',
        '<code>150 false</code>, because <code>a</code> and <code>b</code> are two different variables',
        '<code>100 false</code>, because <code>b = a</code> made a second account holding the same balance'
      ],
      a: 0,
      why: 'An object variable holds a reference, so <code>b = a</code> copies the reference: two names, one account. The deposit through <code>b</code> changes that one account, which <code>a</code> sees. <code>==</code> on objects asks "same object?", and they are. Exactly Week 4&rsquo;s arrays, now with a class you wrote.'
    },
    {
      q: 'What does this print?',
      lang: 'java',
      code: 'Account a = new Account(100);\nAccount c = new Account(100);\nSystem.out.println(a == c);',
      opts: [
        '<code>true</code>, because both accounts were built from the same values',
        '<code>true</code>, because <code>==</code> on objects compares every field in turn',
        '<code>false</code>',
        'It does not compile, because <code>==</code> cannot be used on objects at all'
      ],
      a: 2,
      why: 'Two <code>new</code>s make two objects on the heap, and <code>==</code> on objects compares references — "is this the same object?" — not contents. That is why Strings are compared with <code>.equals</code>. Enums are the pleasant exception: there is only ever one object per value, so <code>==</code> is safe on them.'
    },
    {
      q: 'In a class called <code>Circle</code>, which line starts a <strong>constructor</strong>?',
      opts: [
        '<code>public void Circle(double radius) {</code>',
        '<code>public Circle circle(double radius) {</code>',
        '<code>public static Circle(double radius) {</code>',
        '<code>public Circle(double radius) {</code>'
      ],
      a: 3,
      why: 'A constructor has the class&rsquo;s name and <strong>no return type</strong>, not even <code>void</code>. The trap is the <code>void</code> one: it compiles, but as an ordinary method that happens to be called <code>Circle</code>, so <code>new Circle(2.0)</code> will not find it. The third is a method returning a <code>Circle</code>, and a constructor cannot be <code>static</code>.'
    },
    {
      q: 'What happens when this Python runs?',
      lang: 'python',
      code: 'class Foo:\n    def bar(self):\n        print("bar")\n\nobj = new Foo()\nobj.bar()',
      opts: [
        'It prints <code>bar</code>, because <code>new</code> is optional in Python',
        'A <code>SyntaxError</code>: Python creates objects without <code>new</code>',
        'A <code>NameError</code> at run time, because nothing called <code>new</code> has been defined',
        'It prints <code>bar</code> twice, once from creating the object and once from the call'
      ],
      a: 1,
      why: 'In Python you create an object by calling the class like a function: <code>obj = Foo()</code>. <code>new Foo()</code> is not valid Python at all, so the file fails to parse and nothing runs — a <code>SyntaxError</code>, not a run-time <code>NameError</code>.'
    },
    {
      q: 'What happens when this runs?',
      lang: 'python',
      code: 'class Simple_Class:\n    def func():\n        print("This is a function in the class!")\n\nobj = Simple_Class()\nobj.func()',
      opts: [
        'It prints <code>This is a function in the class!</code>, because <code>func</code> needs no arguments',
        'An <code>AttributeError</code>, because functions in a class can only be called from the class',
        'A <code>TypeError</code>: <code>func()</code> takes 0 positional arguments but 1 was given',
        'A <code>SyntaxError</code>, because every function in a class must have a parameter called <code>self</code>'
      ],
      a: 2,
      why: 'Calling a method <em>through an object</em> passes that object in as the first argument. <code>func</code> has no parameter to receive it, so Python complains that 1 argument was given. The definition itself is legal — <code>Simple_Class.func()</code>, called from the class, works. That extra argument is why instance methods take <code>self</code>.'
    },
    {
      q: 'What does this print?',
      lang: 'python',
      code: 'class Dog:\n    tricks = []\n\n    def __init__(self, name):\n        self.name = name\n\n    def add(self, trick):\n        self.tricks.append(trick)\n\na = Dog("Rex")\nb = Dog("Fido")\na.add("sit")\nprint(b.name, b.tricks)',
      opts: [
        "<code>Fido []</code>, because each dog gets its own <code>tricks</code> list when it is created",
        "<code>Fido ['sit']</code>",
        "<code>Rex ['sit']</code>, because <code>b</code> refers to the same object as <code>a</code>",
        'An <code>AttributeError</code>, because <code>tricks</code> was never set up in <code>__init__</code>'
      ],
      a: 1,
      why: '<code>name</code> is set in <code>__init__</code> through <code>self</code>, so each dog has its own. <code>tricks</code> is created once, in the class body: a <em>class</em> attribute, one list shared by every dog — like a Java <code>static</code> field. <code>append</code> mutates that shared list. Put <code>self.tricks = []</code> in <code>__init__</code> to give each dog its own.'
    },
    {
      q: 'What does this print?',
      lang: 'python',
      code: 'class Foo:\n    baz = "blue"\n\n    @classmethod\n    def bar(cls):\n        print("The class says " + cls.baz)\n\nFoo.bar()',
      opts: [
        '<code>The class says blue</code>',
        'A <code>TypeError</code>, because <code>bar</code> needs an argument for <code>cls</code> and got none',
        'An <code>AttributeError</code>, because class methods cannot read the class&rsquo;s variables',
        'A <code>TypeError</code>, because a class method must be called from an object, not the class'
      ],
      a: 0,
      why: 'A <code>@classmethod</code> receives the class itself as its first parameter, conventionally named <code>cls</code>, and Python supplies it automatically — you do not pass it. Through <code>cls</code> the method can read class attributes such as <code>baz</code>. It is called from the class, like a Java static method.'
    },
    {
      q: 'What does this print?',
      lang: 'python',
      code: 'class Money:\n    def __init__(self, cents):\n        self.cents = cents\n\n    def __str__(self):\n        return "$" + str(self.cents // 100)\n\nm = Money(1250)\nprint(m)\nprint("Total: " + str(m))',
      opts: [
        '<code>$12.5</code>, then <code>Total: $12.5</code>, because <code>//</code> keeps the fraction',
        'Something like <code>&lt;__main__.Money object at 0x…&gt;</code> twice: <code>print</code> ignores <code>__str__</code>',
        '<code>$12</code>, then an error, because an object cannot be joined to a string with <code>+</code>',
        '<code>$12</code>, then <code>Total: $12</code>'
      ],
      a: 3,
      why: '<code>__str__</code> is the dunder method that <code>str()</code> calls, and <code>print</code> uses it too — so both lines show <code>$12</code>. <code>//</code> is floor division, so 1250 // 100 is 12 with no fraction. The <code>+</code> works because <code>str(m)</code> is already a string.'
    },
    {
      q: 'What happens when this runs?',
      lang: 'python',
      code: 'class Vault:\n    __code = 1234\n\nprint(Vault.__code)',
      opts: [
        'It prints <code>1234</code>, because Python attributes are always public',
        'An <code>AttributeError</code>: the name was mangled inside the class',
        'A <code>SyntaxError</code>, because names may not start with two underscores',
        'It prints <code>None</code>, because private attributes read as <code>None</code> from outside'
      ],
      a: 1,
      why: 'A name starting with two underscores (and not ending with two) is rewritten inside the class to <code>_Vault__code</code>. Outside, <code>Vault.__code</code> is not found. (Sometimes the error message even suggests the mangled name, as in section 6.3; here it does not.) It is a strong "keep out" sign rather than true privacy.'
    },
    {
      q: 'And what does this print?',
      lang: 'python',
      code: 'class Vault:\n    __code = 1234\n\nprint(Vault._Vault__code)',
      opts: [
        'An <code>AttributeError</code>, because private attributes cannot be reached from outside at all',
        'A <code>SyntaxError</code>, because the name is written with the class name in front of it',
        '<code>1234</code>',
        '<code>_Vault__code</code>, because the mangled name is printed instead of the value'
      ],
      a: 2,
      why: 'Name mangling only <em>renames</em> the attribute; it does not lock it. Using the mangled name <code>_Vault__code</code> reaches it from anywhere. In the Python tutorial&rsquo;s words: "Private" instance variables that cannot be accessed except from inside an object don&rsquo;t exist in Python.'
    },
    {
      q: 'What does this print?',
      lang: 'python',
      code: 'def three():\n    return 3\n\nclass m:\n    def f():\n        return 0\n\nm.f = three\nprint(m.f())',
      opts: [
        '<code>0</code>, because a class&rsquo;s methods cannot be changed once it is defined',
        'An error, because <code>three</code> is not declared inside the class <code>m</code>',
        '<code>0</code> and then <code>3</code>, because both versions of <code>f</code> are kept and run',
        '<code>3</code>'
      ],
      a: 3,
      why: 'A Python class&rsquo;s attributes behave like a dictionary, and access is public by default, so any code can replace <code>m.f</code> with another function. After the assignment, <code>m.f</code> <em>is</em> <code>three</code>. Java&rsquo;s compiler would reject the whole idea. Just because you can does not mean you should.'
    },
    {
      q: 'What does this print?',
      lang: 'java',
      code: 'public class Cards {\n    enum Suit { HEARTS, SPADES, DIAMONDS, CLUBS; }\n\n    public static void main(String[] args) {\n        Suit a = Suit.HEARTS;\n        Suit b = Suit.values()[0];\n        System.out.println(a + " " + (a == b));\n    }\n}',
      opts: [
        '<code>HEARTS true</code>',
        '<code>0 true</code>, because an enum value prints as its position in the list',
        '<code>HEARTS false</code>, because <code>==</code> compares references and these are two variables',
        'It does not compile, because <code>values()</code> can only be used in a for-each loop'
      ],
      a: 0,
      why: 'An enum value prints as its name. There is exactly one object per enum value — no others can ever be created — so every reference to <code>HEARTS</code> is a reference to the same object, and <code>==</code> is true. <code>values()</code> returns an ordinary array, so indexing it is fine.'
    },
    {
      q: 'Why will this method not compile, even though it has a case for every suit?',
      lang: 'java',
      code: 'enum Suit { HEARTS, SPADES, DIAMONDS, CLUBS; }\n\nstatic String colour(Suit s) {\n    switch (s) {\n        case HEARTS:   return "red";\n        case DIAMONDS: return "red";\n        case SPADES:   return "black";\n        case CLUBS:    return "black";\n    }\n}',
      opts: [
        'The cases must be written as <code>Suit.HEARTS</code> and so on, with the enum&rsquo;s name in front of each value',
        'Two cases returning the same value is an error, so the red suits must be combined into a single case',
        'A <code>switch</code> cannot be used on an enum value at all; the only way to test which value an enum holds is with <code>if</code> and <code>==</code>',
        'A classic switch statement is not checked for covering every value, so the compiler sees a path with no <code>return</code>'
      ],
      a: 3,
      why: 'For a classic switch <em>statement</em>, the compiler does not reason about exhaustiveness, so as far as it knows the switch might match nothing and fall off the end of the method: <em>missing return statement</em>. Add a <code>default</code>. A switch <em>expression</em> (Java 14+) on an enum <em>is</em> checked, which is one of its selling points. Inside the switch, cases are written without the enum name.'
    },
    {
      q: 'What does this print?',
      lang: 'python',
      code: 'from enum import Enum\n\nclass Colour(Enum):\n    RED = 1\n    GREEN = 1\n    BLUE = 2\n\nprint(Colour.GREEN)\nprint(len(Colour))',
      opts: [
        '<code>Colour.GREEN</code>, then <code>3</code>, because every name listed becomes its own member',
        '<code>Colour.RED</code>, then <code>2</code>',
        'A <code>ValueError</code>, because two members of an enum are not allowed to share a value',
        '<code>1</code>, then <code>3</code>, because printing an enum member shows its value'
      ],
      a: 1,
      why: 'A name whose value is already taken becomes an <strong>alias</strong> for the earlier member, so <code>Colour.GREEN</code> <em>is</em> <code>Colour.RED</code> and prints as such. The enum has two members, <code>RED</code> and <code>BLUE</code>. Python allows this silently — which is the Ed lesson&rsquo;s point about Python enums lacking Java&rsquo;s guarantees.'
    },
    {
      q: 'This needs Java 14 or later. What does it print?',
      lang: 'java',
      code: 'int n = 7;\nString s = switch (n % 3) {\n    case 0 -> "fizz";\n    case 1 -> "one";\n    default -> "other";\n};\nSystem.out.println(s);',
      opts: [
        '<code>one</code>',
        '<code>one</code> and then <code>other</code>, because there is no <code>break</code> after the case',
        '<code>other</code>, because a switch expression always ends with its <code>default</code> value',
        'Nothing, because a switch expression cannot be assigned to a variable'
      ],
      a: 0,
      why: '7 % 3 is 1, so the <code>case 1</code> arm gives <code>"one"</code>. With the arrow form there is <strong>no fall-through</strong>: the switch produces the value after the arrow and is finished, so no <code>break</code> is needed. Because it produces a value, it can be assigned — that is the whole point of a switch <em>expression</em>.'
    },
    {
      q: 'This needs Java 21 or later. What does <code>grade(new Student("An", 92))</code> return?',
      lang: 'java',
      code: 'record Student(String name, int mark) {}\n\nstatic String grade(Object o) {\n    return switch (o) {\n        case Student s when s.mark() >= 50 -> "P";\n        case Student s when s.mark() >= 85 -> "HD";\n        case Student s -> "Z";\n        default -> "not a student";\n    };\n}',
      opts: [
        '<code>"HD"</code>, because Java picks the most specific <code>when</code> condition that is true',
        'It does not compile, because two cases may not both match a <code>Student</code>',
        '<code>"P"</code>',
        '<code>"Z"</code>, because a case with no <code>when</code> clause takes priority over the others'
      ],
      a: 2,
      why: 'Cases are tried <strong>in order</strong>, and the first whose pattern matches and whose <code>when</code> is true wins. 92 &gt;= 50, so the first case answers "P" and the HD case is never reached — the same ordering rule as an <code>else if</code> ladder in Weeks 2+3. (Put the <code>&gt;= 85</code> case first.) Guarded cases like these are allowed to overlap.'
    }
  ]
};
