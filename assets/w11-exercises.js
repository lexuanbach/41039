/* Output expectations verified by scripts/check_week_content.py. */
window.WEEK_EXERCISES = [
  {
    "id": "e1",
    "title": "Let each order line compute its subtotal",
    "lang": "java",
    "brief": "Read n, then n pairs of non-negative integers: unit price in cents and quantity. Implement Line.subtotal() and Order.total(). Print the total price. All products and totals fit in Java int.",
    "starter": "import java.util.*;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        int n=sc.nextInt();\n        // use Line objects and an Order instead of duplicating subtotal logic\n    }\n}\n",
    "solution": "import java.util.*;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        int n=sc.nextInt();\n        Order order=new Order();\n        for(int i=0;i<n;i++) order.add(new Line(sc.nextInt(),sc.nextInt()));\n        System.out.println(order.total());\n    }\n}\nclass Line {\n    private final int price,quantity;\n    Line(int price,int quantity) { this.price=price; this.quantity=quantity; }\n    int subtotal() { return price*quantity; }\n}\nclass Order {\n    private final List<Line> lines=new ArrayList<Line>();\n    void add(Line line) { lines.add(line); }\n    int total() { int total=0; for(Line line:lines) total+=line.subtotal(); return total; }\n}\n",
    "tests": [
      {
        "stdin": "2\n300 2\n150 1\n",
        "expect": "750\n"
      },
      {
        "stdin": "0\n",
        "expect": "0\n"
      },
      {
        "stdin": "3\n0 10\n100 0\n1 1\n",
        "expect": "1\n"
      }
    ]
  },
  {
    "id": "e2",
    "title": "Information experts in Python",
    "lang": "python",
    "brief": "Use the same input and output as exercise 1. Put price \u00d7 quantity in Line.subtotal and summation in Order.total.",
    "starter": "class Line:\n    pass\nclass Order:\n    pass\n# read the order, then print its total\n",
    "solution": "class Line:\n    def __init__(self,price,quantity): self.price,self.quantity=price,quantity\n    def subtotal(self): return self.price*self.quantity\nclass Order:\n    def __init__(self): self.lines=[]\n    def add(self,line): self.lines.append(line)\n    def total(self): return sum(line.subtotal() for line in self.lines)\n\norder=Order()\nn=int(input())\nfor _ in range(n):\n    price,quantity=map(int,input().split())\n    order.add(Line(price,quantity))\nprint(order.total())\n",
    "tests": [
      {
        "stdin": "2\n300 2\n150 1\n",
        "expect": "750\n"
      },
      {
        "stdin": "0\n",
        "expect": "0\n"
      },
      {
        "stdin": "3\n0 10\n100 0\n1 1\n",
        "expect": "1\n"
      }
    ]
  },
  {
    "id": "e3",
    "title": "Inject a pricing policy",
    "lang": "java",
    "brief": "Read <code>regular cents</code> or <code>student cents</code>. The student policy charges cents \u00d7 80 / 100, truncating the fractional cent. Define a Pricing interface and pass the selected implementation into Checkout. Print the charge.",
    "starter": "import java.util.Scanner;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        String kind=sc.next(); int cents=sc.nextInt();\n        // build Checkout with a Pricing collaborator\n    }\n}\n",
    "solution": "import java.util.Scanner;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        String kind=sc.next(); int cents=sc.nextInt();\n        Checkout checkout=new Checkout(kind.equals(\"student\") ? new Student() : new Regular());\n        System.out.println(checkout.charge(cents));\n    }\n}\ninterface Pricing { int apply(int cents); }\nclass Regular implements Pricing { public int apply(int cents) { return cents; } }\nclass Student implements Pricing { public int apply(int cents) { return cents*80/100; } }\nclass Checkout {\n    private final Pricing pricing;\n    Checkout(Pricing pricing) { this.pricing=pricing; }\n    int charge(int cents) { return pricing.apply(cents); }\n}\n",
    "tests": [
      {
        "stdin": "regular 125\n",
        "expect": "125\n"
      },
      {
        "stdin": "student 125\n",
        "expect": "100\n"
      },
      {
        "stdin": "student 1\n",
        "expect": "0\n"
      },
      {
        "stdin": "student 0\n",
        "expect": "0\n"
      }
    ]
  },
  {
    "id": "e4",
    "title": "Record the requested notifications",
    "lang": "python",
    "brief": "Read n messages, one per line. Define a Recorder with send(text), pass it to a notify function for each message, then print <code>Sent: n</code> followed by each recorded message. Do not print inside send.",
    "starter": "class Recorder:\n    # record messages rather than printing them\n    pass\n# implement notify, read n messages, then inspect the recorder\n",
    "solution": "class Recorder:\n    def __init__(self): self.messages=[]\n    def send(self,text): self.messages.append(text)\ndef notify(channel,text): channel.send(text)\nr=Recorder()\nn=int(input())\nfor _ in range(n): notify(r,input())\nprint(f\"Sent: {len(r.messages)}\")\nfor message in r.messages: print(message)\n",
    "tests": [
      {
        "stdin": "2\nHello\nDue soon\n",
        "expect": "Sent: 2\nHello\nDue soon\n"
      },
      {
        "stdin": "0\n",
        "expect": "Sent: 0\n"
      },
      {
        "stdin": "1\n\n",
        "expect": "Sent: 1\n\n"
      }
    ]
  },
  {
    "id": "e5",
    "title": "Compute through a collection abstraction",
    "lang": "java",
    "brief": "Read n, then n integer values. Write <code>sum(List&lt;Integer&gt;)</code> and call it once with ArrayList data and once with a LinkedList containing the same data. Print both sums on separate lines.",
    "starter": "import java.util.*;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        // read values, then pass both implementations to one sum method\n    }\n}\n",
    "solution": "import java.util.*;\n\npublic class Demo {\n    static int sum(List<Integer> xs) { int total=0; for(int x:xs) total+=x; return total; }\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        int n=sc.nextInt();\n        List<Integer> a=new ArrayList<Integer>();\n        for(int i=0;i<n;i++) a.add(sc.nextInt());\n        List<Integer> b=new LinkedList<Integer>(a);\n        System.out.println(sum(a)); System.out.println(sum(b));\n    }\n}\n",
    "tests": [
      {
        "stdin": "3\n1 2 3\n",
        "expect": "6\n6\n"
      },
      {
        "stdin": "0\n",
        "expect": "0\n0\n"
      },
      {
        "stdin": "3\n-1 0 1\n",
        "expect": "0\n0\n"
      }
    ]
  },
  {
    "id": "e6",
    "title": "One pass rule used twice",
    "lang": "python",
    "brief": "Read a line of integer marks (possibly empty). Define passes(mark) using threshold 50. Use it to print the number of passes, then a space-separated line of P/F labels in original order.",
    "starter": "def passes(mark):\n    # the single pass rule\n    pass\nmarks=list(map(int,input().split()))\n# use passes for both the count and labels\n",
    "solution": "def passes(mark): return mark>=50\nmarks=list(map(int,input().split()))\nprint(sum(passes(mark) for mark in marks))\nprint(*[\"P\" if passes(mark) else \"F\" for mark in marks])\n",
    "tests": [
      {
        "stdin": "49 50 85\n",
        "expect": "2\nF P P\n"
      },
      {
        "stdin": "\n",
        "expect": "0\n\n"
      },
      {
        "stdin": "0 0\n",
        "expect": "0\nF F\n"
      },
      {
        "stdin": "100\n",
        "expect": "1\nP\n"
      }
    ]
  }
];
