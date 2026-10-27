/* Newly authored practice, adapted from Ed and Canvas topics. */
window.WEEK_DATA = {
  "id": "week-6",
  "quiz": [
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "public class Demo {\n    public static void main(String[] args) {\n        Stock item = new Stock(4);\n        System.out.println(item.take(3));\n        System.out.println(item.take(2));\n        System.out.println(item.getStock());\n    }\n}\nclass Stock {\n    private int stock;\n    Stock(int stock) { this.stock = stock; }\n    boolean take(int amount) {\n        if (amount <= 0 || amount > stock) return false;\n        stock = stock - amount;\n        return true;\n    }\n    int getStock() { return stock; }\n}\n",
      "lang": "java",
      "opts": [
        "<code>true<br>true<br>-1</code>",
        "<code>false<br>true<br>2</code>",
        "<code>true<br>false<br>1</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 2,
      "why": "The first request leaves 1. The second request fails before changing the field, so it stays 1."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "class Stock:\n    def __init__(self, stock):\n        self._stock = stock\n    def take(self, amount):\n        if amount <= 0 or amount > self._stock:\n            return False\n        self._stock -= amount\n        return True\n    def available(self):\n        return self._stock\n\nitem = Stock(4)\nprint(item.take(3))\nprint(item.take(2))\nprint(item.available())\n",
      "lang": "python",
      "opts": [
        "<code>True<br>True<br>-1</code>",
        "<code>False<br>True<br>2</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced.",
        "<code>True<br>False<br>1</code>"
      ],
      "a": 3,
      "why": "Both languages implement the same rule. Python prints booleans with initial capitals."
    },
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "public class Demo {\n    public static void main(String[] args) {\n        Stock a = new Stock(5);\n        Stock b = a;\n        b.take(2);\n        System.out.println(a.getStock());\n        System.out.println(a == b);\n    }\n}\nclass Stock {\n    private int stock;\n    Stock(int stock) { this.stock = stock; }\n    void take(int amount) { stock -= amount; }\n    int getStock() { return stock; }\n}\n",
      "lang": "java",
      "opts": [
        "<code>3<br>true</code>",
        "<code>5<br>false</code>",
        "<code>3<br>false</code>",
        "<code>5<br>true</code>"
      ],
      "a": 0,
      "why": "Assignment makes two names for one stock object. The mutation through b is visible through a."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "class Basket:\n    def __init__(self):\n        self.items = []\n\na = Basket()\nb = Basket()\na.items.append(\"tea\")\nprint(a.items)\nprint(b.items)\nprint(a is b)\n",
      "lang": "python",
      "opts": [
        "<code>[&#x27;tea&#x27;]<br>[&#x27;tea&#x27;]<br>False</code>",
        "<code>[&#x27;tea&#x27;]<br>[]<br>False</code>",
        "<code>[]<br>[]<br>True</code>",
        "<code>[&#x27;tea&#x27;]<br>[]<br>True</code>"
      ],
      "a": 1,
      "why": "Each constructor call allocates a separate items list; only a receives tea."
    },
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "public class Demo {\n    public static void main(String[] args) {\n        Ticket a = new Ticket();\n        Ticket b = new Ticket();\n        System.out.println(a.number + \" \" + b.number + \" \" + Ticket.count);\n    }\n}\nclass Ticket {\n    static int count = 0;\n    final int number;\n    Ticket() { number = ++count; }\n}\n",
      "lang": "java",
      "opts": [
        "<code>1 1 1</code>",
        "<code>2 2 2</code>",
        "<code>1 2 2</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 2,
      "why": "The shared counter reaches 2; a keeps its previously assigned number 1."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "class Basket:\n    items = []\n\na = Basket()\nb = Basket()\na.items.append(\"tea\")\nprint(b.items)\nprint(a.items is b.items)\n",
      "lang": "python",
      "opts": [
        "<code>[]<br>False</code>",
        "<code>[&#x27;tea&#x27;]<br>False</code>",
        "<code>[]<br>True</code>",
        "<code>[&#x27;tea&#x27;]<br>True</code>"
      ],
      "a": 3,
      "why": "Both objects find the class attribute. Move the list into __init__ to give each basket its own storage."
    },
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "public class Demo {\n    public static void main(String[] args) {\n        Book book = new Book(\"Tea\");\n        Shelf shelf = new Shelf(book);\n        System.out.println(shelf.describe());\n    }\n}\nclass Book {\n    private final String title;\n    Book(String title) { this.title = title; }\n    String title() { return title; }\n}\nclass Shelf {\n    private final Book book;\n    Shelf(Book book) { this.book = book; }\n    String describe() { return \"On shelf: \" + book.title(); }\n}\n",
      "lang": "java",
      "opts": [
        "<code>On shelf: Tea</code>",
        "<code>On shelf: Book</code>",
        "<code>Tea</code>",
        "<code>On shelf: null</code>"
      ],
      "a": 0,
      "why": "The shelf delegates to its book for the title, then formats its own description."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "class Book:\n    def __init__(self, title):\n        self.title = title\n    def __str__(self):\n        return f\"Book: {self.title}\"\n\nbook = Book(\"Tea\")\nprint(book)\nprint(book.title)\n",
      "lang": "python",
      "opts": [
        "<code>Tea<br>Tea</code>",
        "<code>Book: Tea<br>Tea</code>",
        "<code>Book: Tea<br>Book: Tea</code>",
        "<code>Book<br>Tea</code>"
      ],
      "a": 1,
      "why": "print(book) uses __str__; reading title directly produces only the title."
    },
    {
      "q": "Which input best tests the lower boundary of take(amount)?",
      "opts": [
        "A very large positive number, because it tests only the upper limit of available stock.",
        "Any positive number smaller than the stock, because ordinary success proves all boundaries.",
        "Zero, because the contract requires a positive amount.",
        "A second object with the same quantity, because identity always determines numeric validity."
      ],
      "a": 2,
      "why": "Zero tests the positive-amount condition; negative values are also useful. A valid ordinary amount does not test rejection."
    },
    {
      "q": "What does Java private contribute to the stock model?",
      "opts": [
        "It automatically rejects every negative value passed to any method of the class.",
        "It guarantees that every method in the class preserves the correct stock invariant.",
        "It makes all stock objects share one common copy of the private field.",
        "It prevents outside code from directly assigning the field."
      ],
      "a": 3,
      "why": "The compiler restricts field access. The constructor and methods must still implement the validation."
    },
    {
      "q": "Which relationship is best represented by composition?",
      "opts": [
        "A shelf has a book.",
        "A triangle is a polygon, so it must contain a polygon instead of being one.",
        "Every Java object is a String because print can display its representation.",
        "Two variables refer to one object, so one variable inherits from the other."
      ],
      "a": 0,
      "why": "A has-a relationship is represented by a member referring to a collaborator."
    },
    {
      "q": "How should you check a state-changing method?",
      "opts": [
        "Check only that it printed a success message, ignoring changes to the object state.",
        "Check its return value and the resulting observable state.",
        "Check only that it compiled, because the type checker proves every business rule.",
        "Check only one successful call, since a rejection cannot possibly change any data."
      ],
      "a": 1,
      "why": "A method can return the expected flag while corrupting its state. Rejected operations also need state checks."
    }
  ]
};
