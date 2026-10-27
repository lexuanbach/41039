/* Output expectations verified by scripts/check_week_content.py. */
window.WEEK_EXERCISES = [
  {
    "id": "e1",
    "title": "An integrated marks report in Java",
    "lang": "java",
    "brief": "Read n, then n records <code>name,mark</code>. Names must be non-empty and contain no commas; mark text is an integer in 0..100 or an invalid word. Any other record shape is invalid. Print <code>Invalid</code> immediately for each rejected record. Then print <code>count,total,passed</code> and one CSV record counting only valid records, their mark sum and the number \u226550. Use Student objects for accepted data.",
    "starter": "import java.util.*;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        int n=Integer.parseInt(sc.nextLine());\n        // parse and validate each row, store valid Student objects, then report\n    }\n}\n",
    "solution": "import java.util.*;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        int n=Integer.parseInt(sc.nextLine());\n        List<Student> records=new ArrayList<Student>();\n        for(int i=0;i<n;i++) {\n            String line=sc.nextLine();\n            String[] parts=line.split(\",\",-1);\n            try {\n                if(parts.length!=2 || parts[0].isEmpty()) throw new IllegalArgumentException();\n                int mark=Integer.parseInt(parts[1]);\n                if(mark<0 || mark>100) throw new IllegalArgumentException();\n                records.add(new Student(parts[0],mark));\n            } catch(IllegalArgumentException e) { System.out.println(\"Invalid\"); }\n        }\n        int total=0,passed=0;\n        for(Student student:records) { total+=student.mark(); if(student.passed()) passed++; }\n        System.out.println(\"count,total,passed\");\n        System.out.println(records.size()+\",\"+total+\",\"+passed);\n    }\n}\nclass Student {\n    private final String name;\n    private final int mark;\n    Student(String name,int mark) { this.name=name; this.mark=mark; }\n    int mark() { return mark; }\n    boolean passed() { return mark>=50; }\n}\n",
    "tests": [
      {
        "stdin": "4\nLinh,85\nAn,bad\nMai,50\nTea,101\n",
        "expect": "Invalid\nInvalid\ncount,total,passed\n2,135,2\n"
      },
      {
        "stdin": "0\n",
        "expect": "count,total,passed\n0,0,0\n"
      },
      {
        "stdin": "3\nA,0\nB,50\nC,100\n",
        "expect": "count,total,passed\n3,150,2\n"
      },
      {
        "stdin": "3\nmissing\n,50\na,b,c\n",
        "expect": "Invalid\nInvalid\nInvalid\ncount,total,passed\n0,0,0\n"
      }
    ]
  },
  {
    "id": "e2",
    "title": "An integrated marks report in Python",
    "lang": "python",
    "brief": "Implement the same input and output policy as exercise 1 using a Student class and a parse function that raises ValueError for invalid rows.",
    "starter": "class Student:\n    pass\ndef parse(line):\n    # return a valid Student or raise ValueError\n    pass\nn=int(input())\n# collect accepted records and print the summary\n",
    "solution": "class Student:\n    def __init__(self,name,mark): self.name,self.mark=name,mark\n    def passed(self): return self.mark>=50\n\ndef parse(line):\n    parts=line.split(\",\")\n    if len(parts)!=2 or not parts[0]: raise ValueError(\"record\")\n    mark=int(parts[1])\n    if not 0<=mark<=100: raise ValueError(\"range\")\n    return Student(parts[0],mark)\n\nn=int(input())\nrecords=[]\nfor _ in range(n):\n    try: records.append(parse(input()))\n    except ValueError: print(\"Invalid\")\nprint(\"count,total,passed\")\nprint(f\"{len(records)},{sum(s.mark for s in records)},{sum(s.passed() for s in records)}\")\n",
    "tests": [
      {
        "stdin": "4\nLinh,85\nAn,bad\nMai,50\nTea,101\n",
        "expect": "Invalid\nInvalid\ncount,total,passed\n2,135,2\n"
      },
      {
        "stdin": "0\n",
        "expect": "count,total,passed\n0,0,0\n"
      },
      {
        "stdin": "3\nA,0\nB,50\nC,100\n",
        "expect": "count,total,passed\n3,150,2\n"
      },
      {
        "stdin": "3\nmissing\n,50\na,b,c\n",
        "expect": "Invalid\nInvalid\nInvalid\ncount,total,passed\n0,0,0\n"
      }
    ]
  },
  {
    "id": "e3",
    "title": "Repair the pass boundary",
    "lang": "java",
    "brief": "Read n, then n integer marks. Count marks \u226550. The starter incorrectly tests >50; fix it and print the count.",
    "starter": "public class Demo {\n    public static void main(String[] args) {\n        java.util.Scanner sc=new java.util.Scanner(System.in);\n        int n=sc.nextInt(),count=0;\n        for(int i=0;i<n;i++) if(sc.nextInt()>50) count++;\n        System.out.println(count);\n    }\n}\n",
    "solution": "public class Demo {\n    public static void main(String[] args) {\n        java.util.Scanner sc=new java.util.Scanner(System.in);\n        int n=sc.nextInt(),count=0;\n        for(int i=0;i<n;i++) if(sc.nextInt()>=50) count++;\n        System.out.println(count);\n    }\n}\n",
    "tests": [
      {
        "stdin": "3\n49 50 85\n",
        "expect": "2\n"
      },
      {
        "stdin": "1\n50\n",
        "expect": "1\n"
      },
      {
        "stdin": "0\n",
        "expect": "0\n"
      }
    ]
  },
  {
    "id": "e4",
    "title": "Repair a shared-list default",
    "lang": "python",
    "brief": "Read two lines of space-separated names, either possibly empty. Make two Group objects with independent member lists. Print the two list sizes. The starter shares one class list; repair it.",
    "starter": "class Group:\n    members=[]\n    def add(self,name): self.members.append(name)\n\na,b=Group(),Group()\nfor name in input().split(): a.add(name)\nfor name in input().split(): b.add(name)\nprint(len(a.members))\nprint(len(b.members))\n",
    "solution": "class Group:\n    def __init__(self): self.members=[]\n    def add(self,name): self.members.append(name)\n\na,b=Group(),Group()\nfor name in input().split(): a.add(name)\nfor name in input().split(): b.add(name)\nprint(len(a.members))\nprint(len(b.members))\n",
    "tests": [
      {
        "stdin": "An Mai\nLinh\n",
        "expect": "2\n1\n"
      },
      {
        "stdin": "\nTea\n",
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
    "title": "Find a maximum with an empty-input policy",
    "lang": "java",
    "brief": "Read n, then n integer values. Print their maximum, or <code>Empty</code> if n is zero. Do not initialise the maximum to 0: all values may be negative.",
    "starter": "public class Demo {\n    public static void main(String[] args) {\n        java.util.Scanner sc=new java.util.Scanner(System.in);\n        int n=sc.nextInt();\n        // handle empty input, otherwise initialise from a real element\n    }\n}\n",
    "solution": "public class Demo {\n    public static void main(String[] args) {\n        java.util.Scanner sc=new java.util.Scanner(System.in);\n        int n=sc.nextInt();\n        if(n==0) System.out.println(\"Empty\");\n        else {\n            int best=sc.nextInt();\n            for(int i=1;i<n;i++) { int x=sc.nextInt(); if(x>best) best=x; }\n            System.out.println(best);\n        }\n    }\n}\n",
    "tests": [
      {
        "stdin": "4\n-8 -2 -10 -3\n",
        "expect": "-2\n"
      },
      {
        "stdin": "0\n",
        "expect": "Empty\n"
      },
      {
        "stdin": "1\n-5\n",
        "expect": "-5\n"
      },
      {
        "stdin": "3\n0 9 1\n",
        "expect": "9\n"
      }
    ]
  },
  {
    "id": "e6",
    "title": "Build a pure filter-and-transform",
    "lang": "python",
    "brief": "Read one line of integers, possibly empty. Define transform(values) to return a new list containing twice each non-negative value, in original order. Print the result values, then the original input values, each as a space-separated line. The function must not mutate its input.",
    "starter": "def transform(values):\n    # keep non-negative values and double them in a new list\n    pass\nvalues=list(map(int,input().split()))\nprint(*transform(values))\nprint(*values)\n",
    "solution": "def transform(values): return [x*2 for x in values if x>=0]\nvalues=list(map(int,input().split()))\nprint(*transform(values))\nprint(*values)\n",
    "tests": [
      {
        "stdin": "-1 0 2 3\n",
        "expect": "0 4 6\n-1 0 2 3\n"
      },
      {
        "stdin": "\n",
        "expect": "\n\n"
      },
      {
        "stdin": "-5 -2\n",
        "expect": "\n-5 -2\n"
      },
      {
        "stdin": "4\n",
        "expect": "8\n4\n"
      }
    ]
  }
];
