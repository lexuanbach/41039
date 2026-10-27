/* Newly authored practice, adapted from Ed and Canvas topics. */
window.WEEK_DATA = {
  "id": "week-11",
  "quiz": [
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "public class Demo {\n    public static void main(String[] args) {\n        Order order=new Order();\n        order.add(new Line(300,2));\n        order.add(new Line(150,1));\n        System.out.println(order.total());\n    }\n}\nclass Line {\n    private final int cents,quantity;\n    Line(int cents,int quantity) { this.cents=cents; this.quantity=quantity; }\n    int subtotal() { return cents*quantity; }\n}\nclass Order {\n    private final java.util.List<Line> lines=new java.util.ArrayList<Line>();\n    void add(Line line) { lines.add(line); }\n    int total() { int sum=0; for(Line line:lines) sum+=line.subtotal(); return sum; }\n}\n",
      "lang": "java",
      "opts": [
        "<code>450</code>",
        "<code>600</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced.",
        "<code>750</code>"
      ],
      "a": 3,
      "why": "Each line computes its own subtotal; Order sums 600 and 150."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "class Order:\n    def __init__(self, amounts): self.amounts=list(amounts)\n    def total(self): return sum(self.amounts)\n\ndef format_receipt(order):\n    return f\"Total: {order.total()} cents\"\n\norder=Order([600,150])\nprint(order.total())\nprint(format_receipt(order))\n",
      "lang": "python",
      "opts": [
        "<code>750<br>Total: 750 cents</code>",
        "<code>750<br>750</code>",
        "<code>Total: 750 cents<br>750</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 0,
      "why": "The calculation returns a number; the formatter builds a human-readable receipt from that result."
    },
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "public class Demo {\n    public static void main(String[] args) {\n        Basket basket=new Basket(new StudentPrice());\n        System.out.println(basket.price(1000));\n    }\n}\ninterface PriceRule { int apply(int cents); }\nclass StudentPrice implements PriceRule {\n    public int apply(int cents) { return cents*80/100; }\n}\nclass Basket {\n    private final PriceRule rule;\n    Basket(PriceRule rule) { this.rule=rule; }\n    int price(int cents) { return rule.apply(cents); }\n}\n",
      "lang": "java",
      "opts": [
        "<code>1000</code>",
        "<code>800</code>",
        "<code>200</code>",
        "<code>80</code>"
      ],
      "a": 1,
      "why": "StudentPrice applies the 80% policy; a new policy can be supplied without changing Basket.price."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "def student_price(cents): return cents*80//100\ndef regular_price(cents): return cents\n\nclass Basket:\n    def __init__(self, rule): self.rule=rule\n    def price(self, cents): return self.rule(cents)\n\nprint(Basket(student_price).price(1000))\nprint(Basket(regular_price).price(1000))\n",
      "lang": "python",
      "opts": [
        "<code>1000<br>800</code>",
        "<code>800<br>800</code>",
        "<code>800<br>1000</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 2,
      "why": "The caller supplies different policies to the same Basket implementation."
    },
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "public class Demo {\n    static void fill(java.util.List<Integer> xs) { xs.add(2); xs.add(3); }\n    public static void main(String[] args) {\n        java.util.List<Integer> a=new java.util.ArrayList<Integer>();\n        java.util.List<Integer> b=new java.util.LinkedList<Integer>();\n        fill(a); fill(b);\n        System.out.println(a.equals(b));\n        System.out.println(a.get(0));\n    }\n}\n",
      "lang": "java",
      "opts": [
        "<code>false<br>2</code>",
        "<code>true<br>3</code>",
        "<code>false<br>3</code>",
        "<code>true<br>2</code>"
      ],
      "a": 3,
      "why": "Both implementations honour append order, so their contents are equal and begin with 2."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "class Screen:\n    def send(self, message): return \"screen: \"+message\nclass Recorder:\n    def __init__(self): self.messages=[]\n    def send(self, message):\n        self.messages.append(message)\n        return \"recorded\"\n\ndef notify(channel, message): return channel.send(message)\nrecorder=Recorder()\nprint(notify(recorder,\"Ready\"))\nprint(recorder.messages)\n",
      "lang": "python",
      "opts": [
        "<code>recorded<br>[&#x27;Ready&#x27;]</code>",
        "<code>screen: Ready<br>[]</code>",
        "<code>recorded<br>[]</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 0,
      "why": "The recorder fulfils the same send capability and stores the message for inspection."
    },
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "public class Demo {\n    public static void main(String[] args) {\n        Stock stock=new Stock(2);\n        Counter counter=new Counter(stock);\n        System.out.println(counter.borrow());\n        System.out.println(counter.borrow());\n        System.out.println(counter.borrow());\n    }\n}\nclass Stock {\n    private int count;\n    Stock(int count) { this.count=count; }\n    boolean take() { if(count==0) return false; count--; return true; }\n}\nclass Counter {\n    private final Stock stock;\n    Counter(Stock stock) { this.stock=stock; }\n    String borrow() { return stock.take() ? \"Borrowed\" : \"Unavailable\"; }\n}\n",
      "lang": "java",
      "opts": [
        "<code>Borrowed<br>Borrowed<br>Borrowed</code>",
        "<code>Borrowed<br>Borrowed<br>Unavailable</code>",
        "<code>Unavailable<br>Borrowed<br>Borrowed</code>",
        "<code>Borrowed<br>Unavailable<br>Unavailable</code>"
      ],
      "a": 1,
      "why": "The controller translates each model result into a response; the third request has no stock left."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "def passes(mark): return mark>=50\n\ndef count_passes(marks):\n    return sum(passes(mark) for mark in marks)\n\ndef labels(marks):\n    return [\"P\" if passes(mark) else \"F\" for mark in marks]\n\nmarks=[49,50,85]\nprint(count_passes(marks))\nprint(labels(marks))\n",
      "lang": "python",
      "opts": [
        "<code>1<br>[&#x27;F&#x27;, &#x27;F&#x27;, &#x27;P&#x27;]</code>",
        "<code>2<br>[&#x27;P&#x27;, &#x27;F&#x27;, &#x27;P&#x27;]</code>",
        "<code>2<br>[&#x27;F&#x27;, &#x27;P&#x27;, &#x27;P&#x27;]</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 2,
      "why": "Exactly 50 passes. Both callers use the same threshold function."
    },
    {
      "q": "What is a sound interpretation of single responsibility?",
      "opts": [
        "A class must contain exactly one method, including its constructors and getters.",
        "A class must combine every application feature so all changes occur in one file.",
        "A class must have no fields, because storing data always creates a second responsibility.",
        "A class groups behaviour around one coherent responsibility."
      ],
      "a": 3,
      "why": "The responsibility is a cohesive concept and reason for change, not a method count."
    },
    {
      "q": "What does dependency inversion encourage in the pricing example?",
      "opts": [
        "Make Basket depend on the pricing capability it needs.",
        "Make every PriceRule depend on the concrete internal fields of Basket in both directions.",
        "Make Basket construct one fixed StudentPrice internally so callers cannot choose another.",
        "Make all fields public so the classes can change one another without method calls."
      ],
      "a": 0,
      "why": "The high-level caller asks for a contract and receives a suitable implementation."
    },
    {
      "q": "Which change most clearly breaks substitutability for List.add(value)?",
      "opts": [
        "Replacing a backing array with linked nodes while preserving all promised list behaviour.",
        "Making it insert at the front instead of appending at the end.",
        "Using a larger internal capacity while preserving element order and all public operations.",
        "Changing a private helper name while preserving the same public contract and outputs."
      ],
      "a": 1,
      "why": "Callers depend on the append contract, not the private storage arrangement."
    },
    {
      "q": "When does YAGNI advise against adding a new feature?",
      "opts": [
        "When the current requirements already require it and a user cannot complete the task without it.",
        "When an existing concrete bug needs a fix to preserve the documented input contract.",
        "When it exists only for an imagined future need.",
        "When an existing test shows the current implementation returns the wrong result."
      ],
      "a": 2,
      "why": "The principle cautions against speculation; required behaviour and bug fixes still matter."
    }
  ]
};
