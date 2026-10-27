/* Output expectations verified by scripts/check_week_content.py. */
window.WEEK_EXERCISES = [
  {
    "id": "e1",
    "title": "Remove duplicates in Java",
    "lang": "java",
    "brief": "Read n, then n integers on the next line (possibly empty when n is 0). Print the values with duplicates removed, preserving first occurrence, separated by single spaces. Print an empty line for an empty result.",
    "starter": "import java.util.*;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        int n=sc.nextInt();\n        // collect first occurrences and print with single spaces\n    }\n}\n",
    "solution": "import java.util.*;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        int n=sc.nextInt();\n        List<Integer> result=new ArrayList<Integer>();\n        for(int i=0;i<n;i++) {\n            int x=sc.nextInt();\n            if(!result.contains(x)) result.add(x);\n        }\n        for(int i=0;i<result.size();i++) {\n            if(i>0) System.out.print(\" \");\n            System.out.print(result.get(i));\n        }\n        System.out.println();\n    }\n}\n",
    "tests": [
      {
        "stdin": "5\n4 1 4 2 1\n",
        "expect": "4 1 2\n"
      },
      {
        "stdin": "0\n\n",
        "expect": "\n"
      },
      {
        "stdin": "4\n7 7 7 7\n",
        "expect": "7\n"
      },
      {
        "stdin": "3\n-1 0 -1\n",
        "expect": "-1 0\n"
      }
    ]
  },
  {
    "id": "e2",
    "title": "Remove duplicates in Python",
    "lang": "python",
    "brief": "Read n, then n integers on the next line (possibly empty when n is 0). Print the values with duplicates removed, preserving first occurrence, separated by single spaces. Print an empty line for an empty result.",
    "starter": "n=int(input())\nvalues=list(map(int,input().split()))\n# preserve the first occurrence of each value\n",
    "solution": "n=int(input())\nvalues=list(map(int,input().split()))\nresult=[]\nfor x in values[:n]:\n    if x not in result: result.append(x)\nprint(*result)\n",
    "tests": [
      {
        "stdin": "5\n4 1 4 2 1\n",
        "expect": "4 1 2\n"
      },
      {
        "stdin": "0\n\n",
        "expect": "\n"
      },
      {
        "stdin": "4\n7 7 7 7\n",
        "expect": "7\n"
      },
      {
        "stdin": "3\n-1 0 -1\n",
        "expect": "-1 0\n"
      }
    ]
  },
  {
    "id": "e3",
    "title": "Delete one occurrence by value",
    "lang": "java",
    "brief": "Read n, then n integers, then a target integer. Remove only its first occurrence by value and print the remaining list using Java list formatting.",
    "starter": "import java.util.*;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        int n=sc.nextInt();\n        // build the list, read target, remove one value, print\n    }\n}\n",
    "solution": "import java.util.*;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        int n=sc.nextInt();\n        ArrayList<Integer> xs=new ArrayList<Integer>();\n        for(int i=0;i<n;i++) xs.add(sc.nextInt());\n        int target=sc.nextInt();\n        xs.remove(Integer.valueOf(target));\n        System.out.println(xs);\n    }\n}\n",
    "tests": [
      {
        "stdin": "3\n4 1 4\n4\n",
        "expect": "[1, 4]\n"
      },
      {
        "stdin": "0\n\n2\n",
        "expect": "[]\n"
      },
      {
        "stdin": "3\n1 2 3\n9\n",
        "expect": "[1, 2, 3]\n"
      }
    ]
  },
  {
    "id": "e4",
    "title": "A waiting queue",
    "lang": "python",
    "brief": "Read n names, one per line, then k (0 \u2264 k \u2264 n). Serve and print the first k names in arrival order. Finally print <code>Waiting: N</code> for the number left. Use deque.",
    "starter": "from collections import deque\nn=int(input())\n# read names and serve k people\n",
    "solution": "from collections import deque\nn=int(input())\nqueue=deque(input() for _ in range(n))\nk=int(input())\nfor _ in range(k): print(queue.popleft())\nprint(f\"Waiting: {len(queue)}\")\n",
    "tests": [
      {
        "stdin": "3\nAn\nMai\nLinh\n2\n",
        "expect": "An\nMai\nWaiting: 1\n"
      },
      {
        "stdin": "0\n0\n",
        "expect": "Waiting: 0\n"
      },
      {
        "stdin": "1\nAn\n1\n",
        "expect": "An\nWaiting: 0\n"
      }
    ]
  },
  {
    "id": "e5",
    "title": "One typed pair",
    "lang": "java",
    "brief": "Read a name on one line and an integer on the next. Implement <code>Pair&lt;A,B&gt;</code> with a constructor and two getters; store the input in <code>Pair&lt;String,Integer&gt;</code>. Print <code>name: number</code>.",
    "starter": "import java.util.*;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        String name=sc.nextLine();\n        int number=Integer.parseInt(sc.nextLine());\n        // use a typed Pair and its getters\n    }\n}\n",
    "solution": "import java.util.*;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        Pair<String,Integer> p=new Pair<String,Integer>(sc.nextLine(),Integer.parseInt(sc.nextLine()));\n        System.out.println(p.first()+\": \"+p.second());\n    }\n}\nclass Pair<A,B> {\n    private final A a; private final B b;\n    Pair(A a,B b) { this.a=a; this.b=b; }\n    A first() { return a; }\n    B second() { return b; }\n}\n",
    "tests": [
      {
        "stdin": "Linh\n9\n",
        "expect": "Linh: 9\n"
      },
      {
        "stdin": "An Mai\n0\n",
        "expect": "An Mai: 0\n"
      },
      {
        "stdin": "Tea\n-3\n",
        "expect": "Tea: -3\n"
      }
    ]
  },
  {
    "id": "e6",
    "title": "Keep passing marks",
    "lang": "python",
    "brief": "Read one line of integer marks, possibly empty. Print only marks \u2265 50 in their original order, separated by single spaces; use an empty line if none pass.",
    "starter": "marks=list(map(int,input().split()))\n# build a filtered list and print it\n",
    "solution": "marks=list(map(int,input().split()))\npassed=[mark for mark in marks if mark>=50]\nprint(*passed)\n",
    "tests": [
      {
        "stdin": "49 50 85 20 50\n",
        "expect": "50 85 50\n"
      },
      {
        "stdin": "\n",
        "expect": "\n"
      },
      {
        "stdin": "1 2 3\n",
        "expect": "\n"
      }
    ]
  }
];
