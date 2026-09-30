/* Week 5 coding exercises — 41039 Programming 1.
 *
 * Every `expect` in this file was produced by RUNNING the solution, not by hand
 * (see architecture.md §Exercises). The Java solutions were compiled with the
 * site's own vendor/ecj.jar at -1.8 and executed on a JVM; the Python solutions were
 * run on CPython 3.14, the same line Pyodide ships. 34 expectations, 0 written by
 * hand. Every Java starter was also compiled and run, so each one starts from a program
 * that works (and fails the tests, as a starter should); the Python starters, which
 * cannot run until the class is written, were syntax-checked.
 *
 * No record, switch-expression or pattern exercises: they need Java 14+, and the
 * in-browser compiler targets Java 8. Enums (Java 5) are fine.
 *
 * Shape: { id, lang, title, brief, starter, solution, tests: [{stdin, expect}] }
 */
window.WEEK_EXERCISES = [
  {
    id: "e1", lang: "java",
    title: "A Rectangle class",
    brief: "Complete the class <code>Rectangle</code>: two <code>private int</code> fields, <code>width</code> and <code>height</code>; a constructor taking both; and three methods &mdash; <code>area()</code>, <code>perimeter()</code> and <code>isSquare()</code> (a <code>boolean</code>).<br><code>main</code> is written for you: it reads a width and a height, builds a <code>Rectangle</code>, and prints three lines, for example<br><code>Area: 12</code><br><code>Perimeter: 14</code><br><code>Square: false</code><br>Sections 2.3 and 4.2.",
    starter: "import java.util.Scanner;\n\npublic class Shapes {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int w = sc.nextInt();\n        int h = sc.nextInt();\n\n        Rectangle r = new Rectangle(w, h);\n        System.out.println(\"Area: \" + r.area());\n        System.out.println(\"Perimeter: \" + r.perimeter());\n        System.out.println(\"Square: \" + r.isSquare());\n    }\n}\n\nclass Rectangle {\n\n    // two private fields, a constructor, and three methods\n\n    public Rectangle(int width, int height) {\n    }\n\n    public int area() {\n        return 0;\n    }\n\n    public int perimeter() {\n        return 0;\n    }\n\n    public boolean isSquare() {\n        return false;\n    }\n}\n",
    solution: "import java.util.Scanner;\n\npublic class Shapes {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int w = sc.nextInt();\n        int h = sc.nextInt();\n\n        Rectangle r = new Rectangle(w, h);\n        System.out.println(\"Area: \" + r.area());\n        System.out.println(\"Perimeter: \" + r.perimeter());\n        System.out.println(\"Square: \" + r.isSquare());\n    }\n}\n\nclass Rectangle {\n\n    private int width;\n    private int height;\n\n    public Rectangle(int width, int height) {\n        this.width = width;\n        this.height = height;\n    }\n\n    public int area() {\n        return this.width * this.height;\n    }\n\n    public int perimeter() {\n        return 2 * (this.width + this.height);\n    }\n\n    public boolean isSquare() {\n        return this.width == this.height;\n    }\n}\n",
    tests: [
      { stdin: "3 4\n", expect: "Area: 12\nPerimeter: 14\nSquare: false\n" },
      { stdin: "5 5\n", expect: "Area: 25\nPerimeter: 20\nSquare: true\n" },
      { stdin: "1 10\n", expect: "Area: 10\nPerimeter: 22\nSquare: false\n" },
      { stdin: "7 2\n", expect: "Area: 14\nPerimeter: 18\nSquare: false\n" }
    ]
  },
  {
    id: "e2", lang: "java",
    title: "A bank account that enforces its rules",
    brief: "Complete <code>BankAccount</code>. It keeps a <code>private int</code> balance in <strong>cents</strong> (section 1.4). <code>deposit(int cents)</code> and <code>withdraw(int cents)</code> each return a <code>boolean</code>: <code>true</code> if they did it, <code>false</code> if they refused. Refuse any amount that is not positive, and any withdrawal larger than the balance.<br><code>main</code> is written for you. It reads a starting balance, then commands &mdash; <code>D 500</code> deposits 500 cents, <code>W 200</code> withdraws &mdash; until <code>Q</code>, printing <code>OK</code> or <code>Refused</code> after each, and finally <code>Balance: 1300</code>. (It compares Strings with <code>.equals</code>, as section 4.4 explains.)",
    starter: "import java.util.Scanner;\n\npublic class Bank {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        BankAccount acc = new BankAccount(sc.nextInt());\n\n        String command = sc.next();\n        while (!command.equals(\"Q\")) {\n            int amount = sc.nextInt();\n            boolean ok;\n            if (command.equals(\"D\")) {\n                ok = acc.deposit(amount);\n            } else {\n                ok = acc.withdraw(amount);\n            }\n            System.out.println(ok ? \"OK\" : \"Refused\");\n            command = sc.next();\n        }\n        System.out.println(\"Balance: \" + acc.getBalance());\n    }\n}\n\nclass BankAccount {\n\n    private int balance;\n\n    public BankAccount(int startingBalance) {\n        this.balance = startingBalance;\n    }\n\n    public boolean deposit(int cents) {\n        return false;\n    }\n\n    public boolean withdraw(int cents) {\n        return false;\n    }\n\n    public int getBalance() {\n        return this.balance;\n    }\n}\n",
    solution: "import java.util.Scanner;\n\npublic class Bank {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        BankAccount acc = new BankAccount(sc.nextInt());\n\n        String command = sc.next();\n        while (!command.equals(\"Q\")) {\n            int amount = sc.nextInt();\n            boolean ok;\n            if (command.equals(\"D\")) {\n                ok = acc.deposit(amount);\n            } else {\n                ok = acc.withdraw(amount);\n            }\n            System.out.println(ok ? \"OK\" : \"Refused\");\n            command = sc.next();\n        }\n        System.out.println(\"Balance: \" + acc.getBalance());\n    }\n}\n\nclass BankAccount {\n\n    private int balance;\n\n    public BankAccount(int startingBalance) {\n        this.balance = startingBalance;\n    }\n\n    public boolean deposit(int cents) {\n        if (cents <= 0) {\n            return false;\n        }\n        this.balance += cents;\n        return true;\n    }\n\n    public boolean withdraw(int cents) {\n        if (cents <= 0 || cents > this.balance) {\n            return false;\n        }\n        this.balance -= cents;\n        return true;\n    }\n\n    public int getBalance() {\n        return this.balance;\n    }\n}\n",
    tests: [
      { stdin: "1000\nD 500\nW 200\nQ\n", expect: "OK\nOK\nBalance: 1300\n" },
      { stdin: "100\nW 500\nD -5\nD 50\nQ\n", expect: "Refused\nRefused\nOK\nBalance: 150\n" },
      { stdin: "0\nQ\n", expect: "Balance: 0\n" },
      { stdin: "250\nW 250\nW 1\nD 0\nQ\n", expect: "OK\nRefused\nRefused\nBalance: 0\n" }
    ]
  },
  {
    id: "e3", lang: "java",
    title: "Constructors that call constructors",
    brief: "Complete <code>Box</code>, which has three <code>private double</code> fields <code>width</code>, <code>height</code> and <code>depth</code>, and <strong>three constructors</strong>:<br>&bull; <code>Box(double w, double h, double d)</code> &mdash; the only one that sets fields;<br>&bull; <code>Box(double side)</code> &mdash; a cube, which must call the first with <code>this(side, side, side)</code>;<br>&bull; <code>Box()</code> &mdash; a unit cube, which must call <code>this(1)</code>.<br>Plus <code>volume()</code>. <code>main</code> is written for you: it reads how many numbers follow (0, 1 or 3), builds the box with the matching constructor, and prints <code>Volume: 24.0</code>. Section 4.3.",
    starter: "import java.util.Scanner;\n\npublic class Boxes {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int k = sc.nextInt();\n        Box b;\n        if (k == 0) {\n            b = new Box();\n        } else if (k == 1) {\n            b = new Box(sc.nextDouble());\n        } else {\n            b = new Box(sc.nextDouble(), sc.nextDouble(), sc.nextDouble());\n        }\n        System.out.println(\"Volume: \" + b.volume());\n    }\n}\n\nclass Box {\n\n    // three private fields, three constructors, and volume()\n\n    public Box() {\n    }\n\n    public Box(double side) {\n    }\n\n    public Box(double w, double h, double d) {\n    }\n\n    public double volume() {\n        return 0;\n    }\n}\n",
    solution: "import java.util.Scanner;\n\npublic class Boxes {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int k = sc.nextInt();\n        Box b;\n        if (k == 0) {\n            b = new Box();\n        } else if (k == 1) {\n            b = new Box(sc.nextDouble());\n        } else {\n            b = new Box(sc.nextDouble(), sc.nextDouble(), sc.nextDouble());\n        }\n        System.out.println(\"Volume: \" + b.volume());\n    }\n}\n\nclass Box {\n\n    private double width;\n    private double height;\n    private double depth;\n\n    public Box() {\n        this(1);\n    }\n\n    public Box(double side) {\n        this(side, side, side);\n    }\n\n    public Box(double w, double h, double d) {\n        this.width = w;\n        this.height = h;\n        this.depth = d;\n    }\n\n    public double volume() {\n        return this.width * this.height * this.depth;\n    }\n}\n",
    tests: [
      { stdin: "3\n2 3 4\n", expect: "Volume: 24.0\n" },
      { stdin: "1\n3\n", expect: "Volume: 27.0\n" },
      { stdin: "0\n", expect: "Volume: 1.0\n" },
      { stdin: "3\n0.5 2 10\n", expect: "Volume: 10.0\n" }
    ]
  },
  {
    id: "e4", lang: "java",
    title: "Numbered tickets, with a static counter",
    brief: "Complete <code>Ticket</code>. A <code>private static int issued</code> counts how many tickets have ever been made; each ticket also has its own <code>private int number</code>. The constructor adds one to <code>issued</code> and gives the new ticket that number. Add <code>getNumber()</code> and a <strong>static</strong> <code>getIssued()</code>.<br><code>main</code> is written for you: it reads <code>n</code>, makes <code>n</code> tickets, then prints <code>Ticket 1 of 3</code>, <code>Ticket 2 of 3</code>, &hellip; and finally <code>Issued: 3</code>. Section 3.1 &mdash; one copy of <code>issued</code>, shared by every ticket.",
    starter: "import java.util.Scanner;\n\npublic class Tickets {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n\n        Ticket[] tickets = new Ticket[n];\n        for (int i = 0; i < n; i++) {\n            tickets[i] = new Ticket();\n        }\n        for (Ticket t : tickets) {\n            System.out.println(\"Ticket \" + t.getNumber() + \" of \" + Ticket.getIssued());\n        }\n        System.out.println(\"Issued: \" + Ticket.getIssued());\n    }\n}\n\nclass Ticket {\n\n    // a static counter, an instance number, a constructor, and two getters\n\n    public int getNumber() {\n        return 0;\n    }\n\n    public static int getIssued() {\n        return 0;\n    }\n}\n",
    solution: "import java.util.Scanner;\n\npublic class Tickets {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n\n        Ticket[] tickets = new Ticket[n];\n        for (int i = 0; i < n; i++) {\n            tickets[i] = new Ticket();\n        }\n        for (Ticket t : tickets) {\n            System.out.println(\"Ticket \" + t.getNumber() + \" of \" + Ticket.getIssued());\n        }\n        System.out.println(\"Issued: \" + Ticket.getIssued());\n    }\n}\n\nclass Ticket {\n\n    private static int issued = 0;\n    private int number;\n\n    public Ticket() {\n        issued++;\n        this.number = issued;\n    }\n\n    public int getNumber() {\n        return this.number;\n    }\n\n    public static int getIssued() {\n        return issued;\n    }\n}\n",
    tests: [
      { stdin: "3\n", expect: "Ticket 1 of 3\nTicket 2 of 3\nTicket 3 of 3\nIssued: 3\n" },
      { stdin: "1\n", expect: "Ticket 1 of 1\nIssued: 1\n" },
      { stdin: "5\n", expect: "Ticket 1 of 5\nTicket 2 of 5\nTicket 3 of 5\nTicket 4 of 5\nTicket 5 of 5\nIssued: 5\n" },
      { stdin: "0\n", expect: "Issued: 0\n" }
    ]
  },
  {
    id: "e5", lang: "java",
    title: "An enum with a method",
    brief: "Complete the enum <code>Suit</code> (values <code>HEARTS, SPADES, DIAMONDS, CLUBS</code>, already there) by giving it a method <code>colour()</code> that returns <code>\"red\"</code> for hearts and diamonds and <code>\"black\"</code> for the others. Use a classic <code>switch</code> on <code>this</code> &mdash; and remember section 7.4: the compiler wants a <code>default</code>.<br>In <code>main</code>, read a number <code>i</code>. If it is from 0 to 3, print the suit at that position of <code>Suit.values()</code> and its colour, like <code>DIAMONDS is red</code>; otherwise print <code>No such suit</code>.",
    starter: "import java.util.Scanner;\n\npublic class Cards {\n\n    enum Suit {\n        HEARTS, SPADES, DIAMONDS, CLUBS;\n\n        // add colour() here\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int i = sc.nextInt();\n\n        // print e.g. \"DIAMONDS is red\", or \"No such suit\"\n    }\n}\n",
    solution: "import java.util.Scanner;\n\npublic class Cards {\n\n    enum Suit {\n        HEARTS, SPADES, DIAMONDS, CLUBS;\n\n        public String colour() {\n            switch (this) {\n                case HEARTS:\n                case DIAMONDS:\n                    return \"red\";\n                default:\n                    return \"black\";\n            }\n        }\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int i = sc.nextInt();\n\n        if (i >= 0 && i < Suit.values().length) {\n            Suit s = Suit.values()[i];\n            System.out.println(s + \" is \" + s.colour());\n        } else {\n            System.out.println(\"No such suit\");\n        }\n    }\n}\n",
    tests: [
      { stdin: "2\n", expect: "DIAMONDS is red\n" },
      { stdin: "0\n", expect: "HEARTS is red\n" },
      { stdin: "1\n", expect: "SPADES is black\n" },
      { stdin: "3\n", expect: "CLUBS is black\n" },
      { stdin: "4\n", expect: "No such suit\n" },
      { stdin: "-1\n", expect: "No such suit\n" }
    ]
  },
  {
    id: "e6", lang: "python",
    title: "A Student class with __init__ and __str__",
    brief: "Write a class <code>Student</code> whose <code>__init__(self, name, mark)</code> stores both on the object; a method <code>grade(self)</code> returning <code>HD</code> (85 and above), <code>D</code> (75+), <code>C</code> (65+), <code>P</code> (50+) or <code>Z</code>; and a <code>__str__</code> returning, for example, <code>Linh: 92 (HD)</code>.<br>The last lines are written for you: they read a name and a mark and <code>print</code> the object &mdash; which calls your <code>__str__</code> (section 6.1).",
    starter: "class Student:\n    # __init__, grade and __str__ go here\n    pass\n\nname = input()\nmark = int(input())\ns = Student(name, mark)\nprint(s)\n",
    solution: "class Student:\n\n    def __init__(self, name, mark):\n        self.name = name\n        self.mark = mark\n\n    def grade(self):\n        if self.mark >= 85:\n            return \"HD\"\n        elif self.mark >= 75:\n            return \"D\"\n        elif self.mark >= 65:\n            return \"C\"\n        elif self.mark >= 50:\n            return \"P\"\n        else:\n            return \"Z\"\n\n    def __str__(self):\n        return self.name + \": \" + str(self.mark) + \" (\" + self.grade() + \")\"\n\nname = input()\nmark = int(input())\ns = Student(name, mark)\nprint(s)\n",
    tests: [
      { stdin: "Linh\n92\n", expect: "Linh: 92 (HD)\n" },
      { stdin: "Bach\n85\n", expect: "Bach: 85 (HD)\n" },
      { stdin: "An\n70\n", expect: "An: 70 (C)\n" },
      { stdin: "Mai\n49\n", expect: "Mai: 49 (Z)\n" },
      { stdin: "Cuong\n50\n", expect: "Cuong: 50 (P)\n" }
    ]
  },
  {
    id: "e7", lang: "python",
    title: "Class data versus instance data",
    brief: "Write a class <code>Ticket</code> &mdash; the Python version of exercise 4. A <strong>class attribute</strong> <code>issued = 0</code> is shared by all tickets. <code>__init__</code> adds one to <code>Ticket.issued</code> and stores the result on the object as <code>self.number</code>. Add a <code>@classmethod</code> called <code>count(cls)</code> that returns <code>cls.issued</code>.<br>The last lines are written for you: they read <code>n</code>, make <code>n</code> tickets, and print each ticket&rsquo;s number with the total so far, then the total.<br>Careful: <code>self.issued += 1</code> would create a separate attribute on the object and leave the class&rsquo;s count at 0. Update it through the class.",
    starter: "class Ticket:\n    issued = 0\n    # __init__ and a classmethod count go here\n\nn = int(input())\ntickets = []\nfor i in range(n):\n    tickets.append(Ticket())\nfor t in tickets:\n    print(\"Ticket \" + str(t.number) + \" of \" + str(Ticket.count()))\nprint(\"Issued: \" + str(Ticket.count()))\n",
    solution: "class Ticket:\n    issued = 0\n\n    def __init__(self):\n        Ticket.issued += 1\n        self.number = Ticket.issued\n\n    @classmethod\n    def count(cls):\n        return cls.issued\n\nn = int(input())\ntickets = []\nfor i in range(n):\n    tickets.append(Ticket())\nfor t in tickets:\n    print(\"Ticket \" + str(t.number) + \" of \" + str(Ticket.count()))\nprint(\"Issued: \" + str(Ticket.count()))\n",
    tests: [
      { stdin: "3\n", expect: "Ticket 1 of 3\nTicket 2 of 3\nTicket 3 of 3\nIssued: 3\n" },
      { stdin: "1\n", expect: "Ticket 1 of 1\nIssued: 1\n" },
      { stdin: "4\n", expect: "Ticket 1 of 4\nTicket 2 of 4\nTicket 3 of 4\nTicket 4 of 4\nIssued: 4\n" }
    ]
  },
  {
    id: "e8", lang: "python",
    title: "A double-underscore balance",
    brief: "Write a Python <code>BankAccount</code> that keeps its balance in cents in an attribute called <code>__balance</code> (section 6.3), with methods <code>deposit(self, cents)</code> and <code>withdraw(self, cents)</code> that return <code>True</code> or <code>False</code> by the same rules as exercise 2, and <code>balance(self)</code> to read it.<br>The rest of the program is written for you: it reads a starting balance, then lines like <code>D 500</code> and <code>W 200</code> until <code>Q</code>, printing <code>OK</code> or <code>Refused</code> after each, then <code>Balance: 1300</code>.",
    starter: "class BankAccount:\n    # __init__, deposit, withdraw and balance go here\n    pass\n\nacc = BankAccount(int(input()))\nline = input()\nwhile line != \"Q\":\n    parts = line.split()\n    amount = int(parts[1])\n    if parts[0] == \"D\":\n        ok = acc.deposit(amount)\n    else:\n        ok = acc.withdraw(amount)\n    if ok:\n        print(\"OK\")\n    else:\n        print(\"Refused\")\n    line = input()\nprint(\"Balance: \" + str(acc.balance()))\n",
    solution: "class BankAccount:\n\n    def __init__(self, starting):\n        self.__balance = starting\n\n    def deposit(self, cents):\n        if cents <= 0:\n            return False\n        self.__balance += cents\n        return True\n\n    def withdraw(self, cents):\n        if cents <= 0 or cents > self.__balance:\n            return False\n        self.__balance -= cents\n        return True\n\n    def balance(self):\n        return self.__balance\n\nacc = BankAccount(int(input()))\nline = input()\nwhile line != \"Q\":\n    parts = line.split()\n    amount = int(parts[1])\n    if parts[0] == \"D\":\n        ok = acc.deposit(amount)\n    else:\n        ok = acc.withdraw(amount)\n    if ok:\n        print(\"OK\")\n    else:\n        print(\"Refused\")\n    line = input()\nprint(\"Balance: \" + str(acc.balance()))\n",
    tests: [
      { stdin: "1000\nD 500\nW 200\nQ\n", expect: "OK\nOK\nBalance: 1300\n" },
      { stdin: "100\nW 500\nD -5\nD 50\nQ\n", expect: "Refused\nRefused\nOK\nBalance: 150\n" },
      { stdin: "0\nQ\n", expect: "Balance: 0\n" },
      { stdin: "250\nW 250\nW 1\nD 0\nQ\n", expect: "OK\nRefused\nRefused\nBalance: 0\n" }
    ]
  }
];
