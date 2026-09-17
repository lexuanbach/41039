/* Weeks 2 & 3 coding exercises — 41039 Programming 1.
 *
 * Every `expect` in this file was produced by RUNNING the solution, not by hand
 * (see architecture.md §Exercises). The Java solutions were compiled with the
 * site's own vendor/ecj.jar at -1.8 and executed; the Python solutions were run
 * on CPython 3.14, the same line Pyodide ships. 36 expectations, 0 written by
 * hand — Java and Python disagree about float formatting (see e4) in ways that
 * are easy to guess wrong.
 *
 * Shape: { id, lang, title, brief, starter, solution, tests: [{stdin, expect}] }
 */
window.WEEK_EXERCISES = [
  {
    id: "e1", lang: "java",
    title: "Grade bands with else if",
    brief: "Read one whole number \u2014 a mark out of 100 \u2014 and print exactly one line:<br><code>High Distinction</code> for 85 and above, <code>Distinction</code> for 75\u201384, <code>Credit</code> for 65\u201374, <code>Pass</code> for 50\u201364, and <code>Fail</code> below 50.<br>Use one <code>if</code> / <code>else if</code> ladder, not five separate <code>if</code> statements \u2014 section 2 shows why that goes wrong.",
    starter: "import java.util.Scanner;\n\npublic class Grade {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int mark = sc.nextInt();\n\n        // print exactly one band\n    }\n}\n",
    solution: "import java.util.Scanner;\n\npublic class Grade {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int mark = sc.nextInt();\n\n        if (mark >= 85) {\n            System.out.println(\"High Distinction\");\n        }\n        else if (mark >= 75) {\n            System.out.println(\"Distinction\");\n        }\n        else if (mark >= 65) {\n            System.out.println(\"Credit\");\n        }\n        else if (mark >= 50) {\n            System.out.println(\"Pass\");\n        }\n        else {\n            System.out.println(\"Fail\");\n        }\n    }\n}\n",
    tests: [
      { stdin: "92\n", expect: "High Distinction\n" },
      { stdin: "85\n", expect: "High Distinction\n" },
      { stdin: "84\n", expect: "Distinction\n" },
      { stdin: "70\n", expect: "Credit\n" },
      { stdin: "50\n", expect: "Pass\n" },
      { stdin: "49\n", expect: "Fail\n" },
      { stdin: "0\n", expect: "Fail\n" }
    ]
  },
  {
    id: "e2", lang: "python",
    title: "Leap year, in Python",
    brief: "Read a year and print <code>Leap</code> or <code>Not leap</code>.<br>A year is a leap year if it is divisible by 4, <strong>except</strong> years divisible by 100, <strong>unless</strong> they are also divisible by 400. So 2024 is a leap year, 1900 is not, and 2000 is.<br>Python uses <code>if</code> / <code>elif</code> / <code>else</code> with a colon and indentation \u2014 no braces, no brackets needed around the condition.",
    starter: "year = int(input())\n\n# print \"Leap\" or \"Not leap\"\n",
    solution: "year = int(input())\n\nif year % 400 == 0:\n    print(\"Leap\")\nelif year % 100 == 0:\n    print(\"Not leap\")\nelif year % 4 == 0:\n    print(\"Leap\")\nelse:\n    print(\"Not leap\")\n",
    tests: [
      { stdin: "2024\n", expect: "Leap\n" },
      { stdin: "1900\n", expect: "Not leap\n" },
      { stdin: "2000\n", expect: "Leap\n" },
      { stdin: "2023\n", expect: "Not leap\n" },
      { stdin: "1600\n", expect: "Leap\n" },
      { stdin: "2100\n", expect: "Not leap\n" }
    ]
  },
  {
    id: "e3", lang: "java",
    title: "The pizza shop, with a switch",
    brief: "Read a selection number and print the pizza. <code>1</code> \u2192 <code>You selected the Vegetarian pizza.</code>, <code>2</code> \u2192 <code>Too Much Meat</code>, <code>3</code> \u2192 <code>Scarparella</code>. Anything else prints <code>That is not on the menu.</code><br>Write it with a <code>switch</code>, and mind the <code>break</code> statements \u2014 section 3 shows what happens without them.",
    starter: "import java.util.Scanner;\n\npublic class Pizza {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int selection = sc.nextInt();\n\n        // switch on selection\n    }\n}\n",
    solution: "import java.util.Scanner;\n\npublic class Pizza {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int selection = sc.nextInt();\n\n        switch (selection) {\n            case 1 :\n                System.out.println(\"You selected the Vegetarian pizza.\");\n                break;\n            case 2 :\n                System.out.println(\"You selected the Too Much Meat pizza.\");\n                break;\n            case 3 :\n                System.out.println(\"You selected the Scarparella pizza.\");\n                break;\n            default :\n                System.out.println(\"That is not on the menu.\");\n                break;\n        }\n    }\n}\n",
    tests: [
      { stdin: "1\n", expect: "You selected the Vegetarian pizza.\n" },
      { stdin: "2\n", expect: "You selected the Too Much Meat pizza.\n" },
      { stdin: "3\n", expect: "You selected the Scarparella pizza.\n" },
      { stdin: "4\n", expect: "That is not on the menu.\n" },
      { stdin: "0\n", expect: "That is not on the menu.\n" }
    ]
  },
  {
    id: "e4", lang: "java",
    title: "Sum and average with a loop",
    brief: "Read a count <code>n</code>, then <code>n</code> whole numbers. Print two lines:<br><code>Sum: 30</code><br><code>Average: 7.5</code><br>The average must be a <strong>real</strong> number, not integer division \u2014 the Week 1 trap, now inside a loop.",
    starter: "import java.util.Scanner;\n\npublic class Average {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n\n        // read n numbers, total them, then print the sum and the average\n    }\n}\n",
    solution: "import java.util.Scanner;\n\npublic class Average {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n\n        int sum = 0;\n        for (int i = 0; i < n; i++) {\n            sum += sc.nextInt();\n        }\n\n        System.out.println(\"Sum: \" + sum);\n        System.out.println(\"Average: \" + ((double) sum / n));\n    }\n}\n",
    tests: [
      { stdin: "4\n5\n10\n7\n8\n", expect: "Sum: 30\nAverage: 7.5\n" },
      { stdin: "3\n1\n2\n3\n", expect: "Sum: 6\nAverage: 2.0\n" },
      { stdin: "1\n9\n", expect: "Sum: 9\nAverage: 9.0\n" },
      { stdin: "3\n1\n1\n1\n", expect: "Sum: 3\nAverage: 1.0\n" },
      { stdin: "2\n7\n8\n", expect: "Sum: 15\nAverage: 7.5\n" }
    ]
  },
  {
    id: "e5", lang: "java",
    title: "A times table, with nested loops",
    brief: "Read a whole number <code>n</code> and print the <code>n</code>&times;<code>n</code> multiplication table. Each row is one line, values separated by a single space, and <strong>a trailing space at the end of a line is forgiven</strong> \u2014 so the simple <code>print(value + \" \")</code> pattern from section 6 works.",
    starter: "import java.util.Scanner;\n\npublic class Table {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n\n        // one loop inside another\n    }\n}\n",
    solution: "import java.util.Scanner;\n\npublic class Table {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n\n        for (int i = 1; i <= n; i++) {\n            for (int j = 1; j <= n; j++) {\n                System.out.print(i * j + \" \");\n            }\n            System.out.println();\n        }\n    }\n}\n",
    tests: [
      { stdin: "3\n", expect: "1 2 3 \n2 4 6 \n3 6 9 \n" },
      { stdin: "1\n", expect: "1 \n" },
      { stdin: "5\n", expect: "1 2 3 4 5 \n2 4 6 8 10 \n3 6 9 12 15 \n4 8 12 16 20 \n5 10 15 20 25 \n" }
    ]
  },
  {
    id: "e6", lang: "java",
    title: "Largest, smallest, and an array",
    brief: "Read a count <code>n</code>, then <code>n</code> whole numbers into an <code>int[]</code>. Print:<br><code>Largest: 12</code><br><code>Smallest: -3</code><br>Store the values in an array first, then walk it. Assume <code>n</code> is at least 1.<br>A tempting bug: starting <code>largest</code> at <code>0</code>. Test 4 below is all negative numbers, and it will catch you.",
    starter: "import java.util.Scanner;\n\npublic class Stats {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] values = new int[n];\n\n        // fill the array, then find the largest and smallest\n    }\n}\n",
    solution: "import java.util.Scanner;\n\npublic class Stats {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] values = new int[n];\n\n        for (int i = 0; i < n; i++) {\n            values[i] = sc.nextInt();\n        }\n\n        int largest = values[0];\n        int smallest = values[0];\n        for (int v : values) {\n            if (v > largest) largest = v;\n            if (v < smallest) smallest = v;\n        }\n\n        System.out.println(\"Largest: \" + largest);\n        System.out.println(\"Smallest: \" + smallest);\n    }\n}\n",
    tests: [
      { stdin: "5\n4\n12\n-3\n7\n0\n", expect: "Largest: 12\nSmallest: -3\n" },
      { stdin: "1\n42\n", expect: "Largest: 42\nSmallest: 42\n" },
      { stdin: "3\n-9\n-2\n-40\n", expect: "Largest: -2\nSmallest: -40\n" },
      { stdin: "4\n5\n5\n5\n5\n", expect: "Largest: 5\nSmallest: 5\n" }
    ]
  },
  {
    id: "e7", lang: "python",
    title: "Build a list, then slice it",
    brief: "Read a count <code>n</code>, then <code>n</code> words, one per line. Build a list with <code>append</code>, then print three lines:<br><code>Count: 4</code><br><code>First: apple</code><br><code>Last: durian</code><br>Use <code>len()</code> for the count \u2014 a Python list has no <code>.length</code>.",
    starter: "n = int(input())\nwords = []\n\n# append n words, then print the count, the first and the last\n",
    solution: "n = int(input())\nwords = []\n\nfor i in range(n):\n    words.append(input())\n\nprint(\"Count: \" + str(len(words)))\nprint(\"First: \" + words[0])\nprint(\"Last: \" + words[len(words) - 1])\n",
    tests: [
      { stdin: "4\napple\nbanana\ncherry\ndurian\n", expect: "Count: 4\nFirst: apple\nLast: durian\n" },
      { stdin: "1\nmango\n", expect: "Count: 1\nFirst: mango\nLast: mango\n" },
      { stdin: "3\nhai\nba\nbon\n", expect: "Count: 3\nFirst: hai\nLast: bon\n" }
    ]
  },
  {
    id: "e8", lang: "python",
    title: "Tally the words with a dict",
    brief: "Read one line of space-separated words and count how many times each appears. Print one line per distinct word, <strong>in the order the word was first seen</strong>:<br><code>pho: 2</code><br><code>banh: 1</code><br>A Python <code>dict</code> keeps its keys in insertion order, so a plain <code>for k in counts:</code> already gives you that order.",
    starter: "line = input()\nwords = line.split()\ncounts = {}\n\n# tally the words, then print each key and its count\n",
    solution: "line = input()\nwords = line.split()\ncounts = {}\n\nfor w in words:\n    if w in counts:\n        counts[w] = counts[w] + 1\n    else:\n        counts[w] = 1\n\nfor k in counts:\n    print(k + \": \" + str(counts[k]))\n",
    tests: [
      { stdin: "pho pho banh\n", expect: "pho: 2\nbanh: 1\n" },
      { stdin: "a b c a b a\n", expect: "a: 3\nb: 2\nc: 1\n" },
      { stdin: "one\n", expect: "one: 1\n" }
    ]
  }
];
