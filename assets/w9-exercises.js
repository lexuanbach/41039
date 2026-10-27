/* Output expectations verified by scripts/check_week_content.py. */
window.WEEK_EXERCISES = [
  {
    "id": "e1",
    "title": "Recover from invalid integers in Java",
    "lang": "java",
    "brief": "Read n, then n lines. Each line is a decimal integer fitting in Java int, or a non-integer word. Print <code>Invalid</code> for each failed conversion; sum only valid integers. Finally print <code>Total: N</code>.",
    "starter": "import java.util.Scanner;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        int n=Integer.parseInt(sc.nextLine());\n        // process all n lines; a bad value must not stop later values\n    }\n}\n",
    "solution": "import java.util.Scanner;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        int n=Integer.parseInt(sc.nextLine());\n        int total=0;\n        for(int i=0;i<n;i++) {\n            try { total+=Integer.parseInt(sc.nextLine()); }\n            catch(NumberFormatException e) { System.out.println(\"Invalid\"); }\n        }\n        System.out.println(\"Total: \"+total);\n    }\n}\n",
    "tests": [
      {
        "stdin": "4\n12\nbad\n-2\n7\n",
        "expect": "Invalid\nTotal: 17\n"
      },
      {
        "stdin": "0\n",
        "expect": "Total: 0\n"
      },
      {
        "stdin": "2\nx\ny\n",
        "expect": "Invalid\nInvalid\nTotal: 0\n"
      },
      {
        "stdin": "2\n0\n100\n",
        "expect": "Total: 100\n"
      }
    ]
  },
  {
    "id": "e2",
    "title": "Recover from invalid integers in Python",
    "lang": "python",
    "brief": "Use the same contract as exercise 1: read n then n lines, report each invalid conversion, and print the total of the valid integers.",
    "starter": "n=int(input())\n# catch ValueError for each conversion\n",
    "solution": "n=int(input())\ntotal=0\nfor _ in range(n):\n    try: total+=int(input())\n    except ValueError: print(\"Invalid\")\nprint(f\"Total: {total}\")\n",
    "tests": [
      {
        "stdin": "4\n12\nbad\n-2\n7\n",
        "expect": "Invalid\nTotal: 17\n"
      },
      {
        "stdin": "0\n",
        "expect": "Total: 0\n"
      },
      {
        "stdin": "2\nx\ny\n",
        "expect": "Invalid\nInvalid\nTotal: 0\n"
      },
      {
        "stdin": "2\n0\n100\n",
        "expect": "Total: 100\n"
      }
    ]
  },
  {
    "id": "e3",
    "title": "Count real lines",
    "lang": "java",
    "brief": "Read all standard input with BufferedReader until EOF. Print the number of lines, including blank lines. A final non-empty line without a newline still counts.",
    "starter": "import java.io.*;\n\npublic class Demo {\n    public static void main(String[] args) {\n        // use BufferedReader and loop until readLine() returns null\n    }\n}\n",
    "solution": "import java.io.*;\n\npublic class Demo {\n    public static void main(String[] args) {\n        int count=0;\n        try {\n            BufferedReader reader=new BufferedReader(new InputStreamReader(System.in));\n            while(reader.readLine()!=null) count++;\n        } catch(IOException e) { throw new RuntimeException(e); }\n        System.out.println(count);\n    }\n}\n",
    "tests": [
      {
        "stdin": "tea\n\ncoffee\n",
        "expect": "3\n"
      },
      {
        "stdin": "",
        "expect": "0\n"
      },
      {
        "stdin": "last line",
        "expect": "1\n"
      },
      {
        "stdin": "\n",
        "expect": "1\n"
      }
    ]
  },
  {
    "id": "e4",
    "title": "Read lines without dropping blanks",
    "lang": "python",
    "brief": "Read all standard input until EOF and print the number of lines, counting blank lines. Use sys.stdin iteration.",
    "starter": "import sys\n# count every line until EOF\n",
    "solution": "import sys\nprint(sum(1 for _ in sys.stdin))\n",
    "tests": [
      {
        "stdin": "tea\n\ncoffee\n",
        "expect": "3\n"
      },
      {
        "stdin": "",
        "expect": "0\n"
      },
      {
        "stdin": "last line",
        "expect": "1\n"
      },
      {
        "stdin": "\n",
        "expect": "1\n"
      }
    ]
  },
  {
    "id": "e5",
    "title": "Validate a mark after parsing",
    "lang": "java",
    "brief": "Read one line. If it cannot be parsed as an int, or is outside 0..100 inclusive, print <code>Invalid</code>. Otherwise print <code>Pass</code> for marks \u226550 or <code>Fail</code>.",
    "starter": "import java.util.Scanner;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        String text=sc.nextLine();\n        // parse, validate the range, then classify\n    }\n}\n",
    "solution": "import java.util.Scanner;\n\npublic class Demo {\n    public static void main(String[] args) {\n        Scanner sc=new Scanner(System.in);\n        try {\n            int mark=Integer.parseInt(sc.nextLine());\n            if(mark<0 || mark>100) System.out.println(\"Invalid\");\n            else System.out.println(mark>=50 ? \"Pass\" : \"Fail\");\n        } catch(NumberFormatException e) { System.out.println(\"Invalid\"); }\n    }\n}\n",
    "tests": [
      {
        "stdin": "50\n",
        "expect": "Pass\n"
      },
      {
        "stdin": "49\n",
        "expect": "Fail\n"
      },
      {
        "stdin": "100\n",
        "expect": "Pass\n"
      },
      {
        "stdin": "101\n",
        "expect": "Invalid\n"
      },
      {
        "stdin": "oops\n",
        "expect": "Invalid\n"
      },
      {
        "stdin": "-1\n",
        "expect": "Invalid\n"
      }
    ]
  },
  {
    "id": "e6",
    "title": "Parse simple mark records",
    "lang": "python",
    "brief": "Read n, then n records of the form <code>name,mark</code>. Names contain no commas; marks are integer text or an invalid word. Print <code>name: mark</code> for a mark in 0..100 and <code>Invalid</code> otherwise. Also print Invalid for a line that does not have exactly two comma-separated fields.",
    "starter": "n=int(input())\n# read, split, validate and report each record\n",
    "solution": "n=int(input())\nfor _ in range(n):\n    parts=input().split(\",\")\n    try:\n        if len(parts)!=2: raise ValueError(\"fields\")\n        value=int(parts[1])\n        if not 0<=value<=100: raise ValueError(\"range\")\n    except ValueError: print(\"Invalid\")\n    else: print(f\"{parts[0]}: {value}\")\n",
    "tests": [
      {
        "stdin": "4\nLinh,85\nAn,bad\nMai,101\nTea,0\n",
        "expect": "Linh: 85\nInvalid\nInvalid\nTea: 0\n"
      },
      {
        "stdin": "2\nmissing\na,b,c\n",
        "expect": "Invalid\nInvalid\n"
      },
      {
        "stdin": "0\n",
        "expect": ""
      }
    ]
  }
];
