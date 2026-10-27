/* Output expectations verified by scripts/check_week_content.py. */
window.WEEK_EXERCISES = [
  {
    "id": "e1",
    "title": "An inventory that refuses invalid requests",
    "lang": "java",
    "brief": "Read an initial stock, a request count, then that many amounts. Print <code>OK</code> or <code>Refused</code> per request, then the remaining stock. Accept only positive amounts no larger than the current stock. The initial stock is non-negative.",
    "starter": "public class Demo {\n    public static void main(String[] args) {\n        java.util.Scanner sc = new java.util.Scanner(System.in);\n        int stock = sc.nextInt(), n = sc.nextInt();\n        for (int i = 0; i < n; i++) {\n            int amount = sc.nextInt();\n            // validate, update stock, and print a result\n        }\n        System.out.println(stock);\n    }\n}\n",
    "solution": "public class Demo {\n    public static void main(String[] args) {\n        java.util.Scanner sc = new java.util.Scanner(System.in);\n        Inventory item = new Inventory(sc.nextInt());\n        int n = sc.nextInt();\n        for (int i=0;i<n;i++) System.out.println(item.take(sc.nextInt()) ? \"OK\" : \"Refused\");\n        System.out.println(item.available());\n    }\n}\nclass Inventory {\n    private int stock;\n    Inventory(int stock) { this.stock = stock; }\n    boolean take(int amount) {\n        if (amount <= 0 || amount > stock) return false;\n        stock -= amount;\n        return true;\n    }\n    int available() { return stock; }\n}\n",
    "tests": [
      {
        "stdin": "5 4\n2 4 0 3\n",
        "expect": "OK\nRefused\nRefused\nOK\n0\n"
      },
      {
        "stdin": "0 2\n1 -1\n",
        "expect": "Refused\nRefused\n0\n"
      },
      {
        "stdin": "3 0\n",
        "expect": "3\n"
      },
      {
        "stdin": "4 2\n4 1\n",
        "expect": "OK\nRefused\n0\n"
      }
    ]
  },
  {
    "id": "e2",
    "title": "Inventory in Python",
    "lang": "python",
    "brief": "Implement the same stock contract as exercise 1. Input: initial stock, request count, then one amount per line. Print <code>OK</code> or <code>Refused</code> for each request, then the stock. Store the stock on an Inventory instance.",
    "starter": "class Inventory:\n    # __init__, take and available\n    pass\n\nstock = int(input())\nn = int(input())\n# process n requests\n",
    "solution": "class Inventory:\n    def __init__(self, stock): self._stock = stock\n    def take(self, amount):\n        if amount <= 0 or amount > self._stock: return False\n        self._stock -= amount\n        return True\n    def available(self): return self._stock\n\nitem = Inventory(int(input()))\nn = int(input())\nfor _ in range(n):\n    print(\"OK\" if item.take(int(input())) else \"Refused\")\nprint(item.available())\n",
    "tests": [
      {
        "stdin": "5\n4\n2\n4\n0\n3\n",
        "expect": "OK\nRefused\nRefused\nOK\n0\n"
      },
      {
        "stdin": "0\n2\n1\n-1\n",
        "expect": "Refused\nRefused\n0\n"
      },
      {
        "stdin": "3\n0\n",
        "expect": "3\n"
      }
    ]
  },
  {
    "id": "e3",
    "title": "Construct valid rectangles",
    "lang": "java",
    "brief": "Read two positive integers width and height. Write a Rectangle class with private dimensions, a constructor and area(). Print area and perimeter, separated by a space.",
    "starter": "public class Demo {\n    public static void main(String[] args) {\n        java.util.Scanner sc = new java.util.Scanner(System.in);\n        int width=sc.nextInt(), height=sc.nextInt();\n        // construct a Rectangle and print area and perimeter\n    }\n}\n",
    "solution": "public class Demo {\n    public static void main(String[] args) {\n        java.util.Scanner sc = new java.util.Scanner(System.in);\n        Rectangle r = new Rectangle(sc.nextInt(),sc.nextInt());\n        System.out.println(r.area()+\" \"+r.perimeter());\n    }\n}\nclass Rectangle {\n    private final int w,h;\n    Rectangle(int w,int h) { this.w=w; this.h=h; }\n    int area() { return w*h; }\n    int perimeter() { return 2*(w+h); }\n}\n",
    "tests": [
      {
        "stdin": "3 4\n",
        "expect": "12 14\n"
      },
      {
        "stdin": "1 1\n",
        "expect": "1 4\n"
      },
      {
        "stdin": "10 2\n",
        "expect": "20 24\n"
      }
    ]
  },
  {
    "id": "e4",
    "title": "Fresh baskets",
    "lang": "python",
    "brief": "Read two lines of space-separated item names; a line may be empty. Put each line in a separate Basket instance, using a fresh list per object. Print the number of items in the first basket and then in the second.",
    "starter": "class Basket:\n    # create a separate list for every instance\n    pass\n\nfirst = input().split()\nsecond = input().split()\n# put names in their corresponding baskets and print sizes\n",
    "solution": "class Basket:\n    def __init__(self): self.items=[]\n    def add(self,name): self.items.append(name)\n\na,b=Basket(),Basket()\nfor name in input().split(): a.add(name)\nfor name in input().split(): b.add(name)\nprint(len(a.items))\nprint(len(b.items))\n",
    "tests": [
      {
        "stdin": "tea milk\nbread\n",
        "expect": "2\n1\n"
      },
      {
        "stdin": "\ncoffee\n",
        "expect": "0\n1\n"
      },
      {
        "stdin": "\n\n",
        "expect": "0\n0\n"
      }
    ]
  },
  {
    "id": "e5",
    "title": "Ticket numbering",
    "lang": "java",
    "brief": "Read n (0 to 20). Construct n Ticket objects, each with a shared counter and its own number. Print their numbers one per line, then <code>Total: n</code>.",
    "starter": "public class Demo {\n    public static void main(String[] args) {\n        java.util.Scanner sc = new java.util.Scanner(System.in);\n        int n = sc.nextInt();\n        // construct and number the tickets\n    }\n}\n",
    "solution": "public class Demo {\n    public static void main(String[] args) {\n        java.util.Scanner sc = new java.util.Scanner(System.in);\n        int n=sc.nextInt();\n        for(int i=0;i<n;i++) System.out.println(new Ticket().number);\n        System.out.println(\"Total: \"+Ticket.count);\n    }\n}\nclass Ticket {\n    static int count=0;\n    final int number;\n    Ticket() { number=++count; }\n}\n",
    "tests": [
      {
        "stdin": "3\n",
        "expect": "1\n2\n3\nTotal: 3\n"
      },
      {
        "stdin": "0\n",
        "expect": "Total: 0\n"
      },
      {
        "stdin": "1\n",
        "expect": "1\nTotal: 1\n"
      }
    ]
  },
  {
    "id": "e6",
    "title": "A readable book",
    "lang": "python",
    "brief": "Read a title, then a non-negative page count. Implement Book.__str__ so printing the object produces exactly <code>Title (N pages)</code>. The title may contain spaces.",
    "starter": "class Book:\n    # __init__ and __str__\n    pass\n\ntitle=input()\npages=int(input())\n# construct and print the book\n",
    "solution": "class Book:\n    def __init__(self,title,pages): self.title,self.pages=title,pages\n    def __str__(self): return f\"{self.title} ({self.pages} pages)\"\n\nprint(Book(input(),int(input())))\n",
    "tests": [
      {
        "stdin": "Learning Java\n120\n",
        "expect": "Learning Java (120 pages)\n"
      },
      {
        "stdin": "Empty\n0\n",
        "expect": "Empty (0 pages)\n"
      },
      {
        "stdin": "A\n1\n",
        "expect": "A (1 pages)\n"
      }
    ]
  }
];
