/* Output expectations verified by scripts/check_week_content.py. */
window.WEEK_EXERCISES = [
  {
    "id": "e1",
    "title": "Write a summary in Java",
    "lang": "java",
    "brief": "Read n, then n integer marks in 0..100. Print a CSV header <code>count,total,passed</code>, then n, the sum, and the number \u226550. Standard output stands in for a report file.",
    "starter": "import java.util.Scanner;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        int n=sc.nextInt();\n        // compute then print the header and record\n    }\n}\n",
    "solution": "import java.util.Scanner;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        int n=sc.nextInt(),total=0,passed=0;\n        for(int i=0;i<n;i++) { int mark=sc.nextInt(); total+=mark; if(mark>=50) passed++; }\n        System.out.println(\"count,total,passed\");\n        System.out.println(n+\",\"+total+\",\"+passed);\n    }\n}\n",
    "tests": [
      {
        "stdin": "3\n85 49 50\n",
        "expect": "count,total,passed\n3,184,2\n"
      },
      {
        "stdin": "0\n\n",
        "expect": "count,total,passed\n0,0,0\n"
      },
      {
        "stdin": "3\n0 0 0\n",
        "expect": "count,total,passed\n3,0,0\n"
      },
      {
        "stdin": "2\n100 50\n",
        "expect": "count,total,passed\n2,150,2\n"
      }
    ]
  },
  {
    "id": "e2",
    "title": "Write a summary in Python",
    "lang": "python",
    "brief": "Use the same report contract as exercise 1. Input contains n, then one line with the n marks (empty if n is zero). Print the header and one summary record.",
    "starter": "n=int(input())\nmarks=list(map(int,input().split()))\n# print the summary\n",
    "solution": "n=int(input())\nmarks=list(map(int,input().split()))[:n]\nprint(\"count,total,passed\")\nprint(f\"{n},{sum(marks)},{sum(mark>=50 for mark in marks)}\")\n",
    "tests": [
      {
        "stdin": "3\n85 49 50\n",
        "expect": "count,total,passed\n3,184,2\n"
      },
      {
        "stdin": "0\n\n",
        "expect": "count,total,passed\n0,0,0\n"
      },
      {
        "stdin": "3\n0 0 0\n",
        "expect": "count,total,passed\n3,0,0\n"
      },
      {
        "stdin": "2\n100 50\n",
        "expect": "count,total,passed\n2,150,2\n"
      }
    ]
  },
  {
    "id": "e3",
    "title": "Format simple records in Java",
    "lang": "java",
    "brief": "Read n, then n lines of <code>name mark</code>. Names have no spaces or commas. Print header <code>name,mark</code>, then one comma-separated record per line, preserving order.",
    "starter": "import java.util.Scanner;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        int n=sc.nextInt();\n        // print the header and n formatted records\n    }\n}\n",
    "solution": "import java.util.Scanner;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        int n=sc.nextInt();\n        System.out.println(\"name,mark\");\n        for(int i=0;i<n;i++) System.out.println(sc.next()+\",\"+sc.nextInt());\n    }\n}\n",
    "tests": [
      {
        "stdin": "2\nLinh 85\nAn 49\n",
        "expect": "name,mark\nLinh,85\nAn,49\n"
      },
      {
        "stdin": "0\n",
        "expect": "name,mark\n"
      },
      {
        "stdin": "1\nMai 0\n",
        "expect": "name,mark\nMai,0\n"
      }
    ]
  },
  {
    "id": "e4",
    "title": "Write correctly quoted CSV",
    "lang": "python",
    "brief": "Read a name on the first line, then an integer mark. Write a single CSV record using csv.writer on sys.stdout with lineterminator set to <code>\"\\n\"</code>. Names may contain commas or quotes; do not manually join the fields.",
    "starter": "import csv\nimport sys\nname=input()\nmark=int(input())\n# use csv.writer to output one record\n",
    "solution": "import csv\nimport sys\nname=input()\nmark=int(input())\ncsv.writer(sys.stdout,lineterminator=\"\\n\").writerow([name,mark])\n",
    "tests": [
      {
        "stdin": "An, Mai\n85\n",
        "expect": "\"An, Mai\",85\n"
      },
      {
        "stdin": "Linh\n0\n",
        "expect": "Linh,0\n"
      },
      {
        "stdin": "A \"B\"\n50\n",
        "expect": "\"A \"\"B\"\"\",50\n"
      }
    ]
  },
  {
    "id": "e5",
    "title": "Number output lines",
    "lang": "java",
    "brief": "Read all standard input as lines until EOF. Print each one prefixed with its 1-based number and <code>: </code>. Keep blank lines as numbered records.",
    "starter": "import java.util.Scanner;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        // read full lines, including blanks, and number them\n    }\n}\n",
    "solution": "import java.util.Scanner;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        int i=1;\n        while(sc.hasNextLine()) System.out.println((i++)+\": \"+sc.nextLine());\n    }\n}\n",
    "tests": [
      {
        "stdin": "tea\n\ncoffee\n",
        "expect": "1: tea\n2: \n3: coffee\n"
      },
      {
        "stdin": "",
        "expect": ""
      },
      {
        "stdin": "one",
        "expect": "1: one\n"
      }
    ]
  },
  {
    "id": "e6",
    "title": "Read and validate a JSON report",
    "lang": "python",
    "brief": "Read one JSON object on one line with a name string and a marks list of integers in 0..100. Inputs satisfy this structure. Print <code>NAME: TOTAL</code>. Keep parsing separate from summing.",
    "starter": "import json\nrecord=json.loads(input())\n# sum the marks and format the result\n",
    "solution": "import json\nrecord=json.loads(input())\nprint(f\"{record['name']}: {sum(record['marks'])}\")\n",
    "tests": [
      {
        "stdin": "{\"name\":\"Linh\",\"marks\":[85,90]}\n",
        "expect": "Linh: 175\n"
      },
      {
        "stdin": "{\"name\":\"An\",\"marks\":[]}\n",
        "expect": "An: 0\n"
      },
      {
        "stdin": "{\"name\":\"Mai Tea\",\"marks\":[0,50,100]}\n",
        "expect": "Mai Tea: 150\n"
      }
    ]
  }
];
