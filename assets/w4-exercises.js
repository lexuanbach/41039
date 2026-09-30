/* Week 4 coding exercises — 41039 Programming 1.
 *
 * Every `expect` in this file was produced by RUNNING the solution, not by hand
 * (see architecture.md §Exercises). The Java solutions were compiled with the
 * site's own vendor/ecj.jar at -1.8 and executed on a JVM; the Python solutions were
 * run on CPython 3.14, the same line Pyodide ships. 35 expectations, 0 written by
 * hand. Every starter was also compiled and run, so each one starts from a program
 * that works (and fails the tests, as a starter should).
 *
 * No record exercises: records need Java 16+, and the in-browser compiler targets 8.
 *
 * Shape: { id, lang, title, brief, starter, solution, tests: [{stdin, expect}] }
 */
window.WEEK_EXERCISES = [
  {
    id: "e1", lang: "java",
    title: "Overload max",
    brief: "Write <strong>two</strong> methods called <code>max</code>: one that takes two <code>int</code>s and returns the larger, and one that takes three <code>int</code>s and returns the largest. The three-parameter version should <em>call</em> the two-parameter one rather than repeat its logic.<br>Then read three whole numbers and print exactly two lines:<br><code>Larger of the first two: 7</code><br><code>Largest of all three: 9</code><br>Section 3.3 shows how Java picks between methods with the same name.",
    starter: "import java.util.Scanner;\n\npublic class Max {\n\n    // write max(int, int) and max(int, int, int) here\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        int c = sc.nextInt();\n\n        // print the two lines, using your max methods\n    }\n}\n",
    solution: "import java.util.Scanner;\n\npublic class Max {\n\n    public static int max(int a, int b) {\n        if (a > b) {\n            return a;\n        }\n        return b;\n    }\n\n    public static int max(int a, int b, int c) {\n        return max(max(a, b), c);\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        int c = sc.nextInt();\n\n        System.out.println(\"Larger of the first two: \" + max(a, b));\n        System.out.println(\"Largest of all three: \" + max(a, b, c));\n    }\n}\n",
    tests: [
      { stdin: "3 7 9\n", expect: "Larger of the first two: 7\nLargest of all three: 9\n" },
      { stdin: "10 2 5\n", expect: "Larger of the first two: 10\nLargest of all three: 10\n" },
      { stdin: "4 4 4\n", expect: "Larger of the first two: 4\nLargest of all three: 4\n" },
      { stdin: "-3 -8 -1\n", expect: "Larger of the first two: -3\nLargest of all three: -1\n" },
      { stdin: "0 15 -20\n", expect: "Larger of the first two: 15\nLargest of all three: 15\n" }
    ]
  },
  {
    id: "e2", lang: "java",
    title: "isPrime, and stopping early",
    brief: "Write <code>public static boolean isPrime(int n)</code>: a number is prime if it is at least 2 and has no factor between 2 and <code>n - 1</code>. Use <code>return</code> to stop as soon as you know the answer (section 2.4) &mdash; there is no need to keep checking after finding a factor.<br>Then read <code>n</code> and print every prime from 2 to <code>n</code> inclusive on one line, each followed by a space. If there are none, print <code>No primes</code> instead.<br>For <code>10</code>: <code>2 3 5 7 </code>",
    starter: "import java.util.Scanner;\n\npublic class Primes {\n\n    public static boolean isPrime(int n) {\n        // return true if n is prime, false otherwise\n        return false;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n\n        // print the primes from 2 to n, or \"No primes\"\n    }\n}\n",
    solution: "import java.util.Scanner;\n\npublic class Primes {\n\n    public static boolean isPrime(int n) {\n        if (n < 2) {\n            return false;\n        }\n        for (int f = 2; f < n; f++) {\n            if (n % f == 0) {\n                return false;       // found a factor: stop early\n            }\n        }\n        return true;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n\n        if (n < 2) {\n            System.out.println(\"No primes\");\n            return;\n        }\n        for (int i = 2; i <= n; i++) {\n            if (isPrime(i)) {\n                System.out.print(i + \" \");\n            }\n        }\n        System.out.println();\n    }\n}\n",
    tests: [
      { stdin: "10\n", expect: "2 3 5 7 \n" },
      { stdin: "2\n", expect: "2 \n" },
      { stdin: "1\n", expect: "No primes\n" },
      { stdin: "30\n", expect: "2 3 5 7 11 13 17 19 23 29 \n" },
      { stdin: "0\n", expect: "No primes\n" }
    ]
  },
  {
    id: "e3", lang: "java",
    title: "A function that builds, a procedure that prints",
    brief: "Write two methods:<br>&bull; <code>public static String stars(int n)</code> &mdash; a <strong>function</strong>: it <em>returns</em> a String of <code>n</code> asterisks and prints nothing.<br>&bull; <code>public static void triangle(int rows)</code> &mdash; a <strong>procedure</strong>: it prints <code>rows</code> lines, line <em>i</em> holding <em>i</em> stars, by calling <code>stars</code>.<br>Read <code>rows</code> and call <code>triangle</code>. For <code>3</code>:<br><code>*</code><br><code>**</code><br><code>***</code><br>Section 3.5 explains the difference between the two kinds of method.",
    starter: "import java.util.Scanner;\n\npublic class Triangle {\n\n    public static String stars(int n) {\n        // build and return a String of n asterisks\n        return \"\";\n    }\n\n    public static void triangle(int rows) {\n        // print the triangle, calling stars\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        triangle(rows);\n    }\n}\n",
    solution: "import java.util.Scanner;\n\npublic class Triangle {\n\n    public static String stars(int n) {\n        String s = \"\";\n        for (int i = 0; i < n; i++) {\n            s += \"*\";\n        }\n        return s;\n    }\n\n    public static void triangle(int rows) {\n        for (int i = 1; i <= rows; i++) {\n            System.out.println(stars(i));\n        }\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int rows = sc.nextInt();\n        triangle(rows);\n    }\n}\n",
    tests: [
      { stdin: "3\n", expect: "*\n**\n***\n" },
      { stdin: "1\n", expect: "*\n" },
      { stdin: "5\n", expect: "*\n**\n***\n****\n*****\n" },
      { stdin: "2\n", expect: "*\n**\n" }
    ]
  },
  {
    id: "e4", lang: "java",
    title: "Varargs average",
    brief: "Write <code>public static double average(int... nums)</code> that returns the average of however many numbers it is given, or <code>0.0</code> if it is given none.<br>Then read a count <code>n</code> followed by <code>n</code> whole numbers, store them in an <code>int[]</code>, and print <code>Average: </code> followed by <code>average(</code>your array<code>)</code>. A varargs parameter really is an array, so you can pass one straight in (section 3.4).<br>Watch the division: the sum is an <code>int</code>, and <code>7 / 2</code> is <code>3</code> in Java.",
    starter: "import java.util.Scanner;\n\npublic class Average {\n\n    public static double average(int... nums) {\n        // return the average, or 0.0 if there are no numbers\n        return 0.0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] values = new int[n];\n        for (int i = 0; i < n; i++) {\n            values[i] = sc.nextInt();\n        }\n\n        // print \"Average: \" followed by the average\n    }\n}\n",
    solution: "import java.util.Scanner;\n\npublic class Average {\n\n    public static double average(int... nums) {\n        if (nums.length == 0) {\n            return 0.0;\n        }\n        int sum = 0;\n        for (int n : nums) {\n            sum += n;\n        }\n        return (double) sum / nums.length;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] values = new int[n];\n        for (int i = 0; i < n; i++) {\n            values[i] = sc.nextInt();\n        }\n\n        System.out.println(\"Average: \" + average(values));\n    }\n}\n",
    tests: [
      { stdin: "4\n1 2 3 4\n", expect: "Average: 2.5\n" },
      { stdin: "2\n7 8\n", expect: "Average: 7.5\n" },
      { stdin: "3\n10 10 10\n", expect: "Average: 10.0\n" },
      { stdin: "0\n", expect: "Average: 0.0\n" },
      { stdin: "1\n-5\n", expect: "Average: -5.0\n" }
    ]
  },
  {
    id: "e5", lang: "java",
    title: "Reverse an array in place",
    brief: "Write <code>public static void reverse(int[] a)</code>. It returns <strong>nothing</strong>: it reverses the array it is given by swapping elements from the two ends inwards. <code>main</code> is written for you and prints the array after calling <code>reverse</code>.<br>This works only because the parameter is a copy of a <em>reference</em> to the caller&rsquo;s array (section 7.2). Making a new array inside <code>reverse</code> and assigning it to <code>a</code> would change nothing the caller can see &mdash; try it and watch the test fail.",
    starter: "import java.util.Scanner;\n\npublic class Reverse {\n\n    public static void reverse(int[] a) {\n        // reverse a in place: swap a[0] with the last element, and so on\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] values = new int[n];\n        for (int i = 0; i < n; i++) {\n            values[i] = sc.nextInt();\n        }\n\n        reverse(values);\n\n        for (int v : values) {\n            System.out.print(v + \" \");\n        }\n        System.out.println();\n    }\n}\n",
    solution: "import java.util.Scanner;\n\npublic class Reverse {\n\n    public static void reverse(int[] a) {\n        for (int i = 0; i < a.length / 2; i++) {\n            int j = a.length - 1 - i;\n            int temp = a[i];\n            a[i] = a[j];\n            a[j] = temp;\n        }\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] values = new int[n];\n        for (int i = 0; i < n; i++) {\n            values[i] = sc.nextInt();\n        }\n\n        reverse(values);\n\n        for (int v : values) {\n            System.out.print(v + \" \");\n        }\n        System.out.println();\n    }\n}\n",
    tests: [
      { stdin: "5\n1 2 3 4 5\n", expect: "5 4 3 2 1 \n" },
      { stdin: "4\n10 20 30 40\n", expect: "40 30 20 10 \n" },
      { stdin: "1\n42\n", expect: "42 \n" },
      { stdin: "2\n-1 1\n", expect: "1 -1 \n" }
    ]
  },
  {
    id: "e6", lang: "python",
    title: "A default and a keyword argument",
    brief: "Write <code>describe(name, age, city=\"Ho Chi Minh City\")</code>, which <strong>returns</strong> (not prints) a string like <code>Linh is 19 and lives in Hanoi.</code><br>The program reads three lines: a name, an age, and a city &mdash; which may be <strong>blank</strong>. If the city line is blank, call <code>describe</code> with just two arguments so the default is used; otherwise pass the city <strong>by name</strong>: <code>city=city</code>. Print what <code>describe</code> returns.<br>Sections 5.1 and 5.2.",
    starter: "def describe(name, age, city=\"Ho Chi Minh City\"):\n    # return the sentence\n    pass\n\nname = input()\nage = int(input())\ncity = input()\n\n# call describe with two arguments if city is blank,\n# otherwise pass city by keyword, and print the result\n",
    solution: "def describe(name, age, city=\"Ho Chi Minh City\"):\n    return name + \" is \" + str(age) + \" and lives in \" + city + \".\"\n\nname = input()\nage = int(input())\ncity = input()\n\nif city == \"\":\n    print(describe(name, age))\nelse:\n    print(describe(name, age, city=city))\n",
    tests: [
      { stdin: "Linh\n19\nHanoi\n", expect: "Linh is 19 and lives in Hanoi.\n" },
      { stdin: "Bach\n21\n\n", expect: "Bach is 21 and lives in Ho Chi Minh City.\n" },
      { stdin: "An\n18\nDa Nang\n", expect: "An is 18 and lives in Da Nang.\n" },
      { stdin: "Mai\n20\n\n", expect: "Mai is 20 and lives in Ho Chi Minh City.\n" }
    ]
  },
  {
    id: "e7", lang: "python",
    title: "Mutate, don't rebind",
    brief: "Write <code>remove_negatives(values)</code>. It must <strong>change the list it is given</strong> so that only the numbers <code>&gt;= 0</code> remain, in their original order &mdash; and return nothing. The rest of the program is written for you: it reads a line of whole numbers, calls your function, and prints the list.<br>The obvious attempt, building a new list and writing <code>values = kept</code>, only re-points the local name, so the caller&rsquo;s list is untouched and the tests fail (section 7.4). Build the new list, then put its contents <em>into</em> the old one &mdash; slice assignment from Weeks 2+3 does exactly that: <code>values[:] = kept</code>.",
    starter: "def remove_negatives(values):\n    # change values itself; do not return anything\n    pass\n\nnumbers = []\nfor word in input().split():\n    numbers.append(int(word))\n\nremove_negatives(numbers)\nprint(numbers)\n",
    solution: "def remove_negatives(values):\n    kept = []\n    for v in values:\n        if v >= 0:\n            kept.append(v)\n    values[:] = kept        # mutate the caller's list, don't rebind the name\n\nnumbers = []\nfor word in input().split():\n    numbers.append(int(word))\n\nremove_negatives(numbers)\nprint(numbers)\n",
    tests: [
      { stdin: "3 -1 4 -1 5\n", expect: "[3, 4, 5]\n" },
      { stdin: "-2 -7\n", expect: "[]\n" },
      { stdin: "0 8 -3 0\n", expect: "[0, 8, 0]\n" },
      { stdin: "1 2 3\n", expect: "[1, 2, 3]\n" }
    ]
  },
  {
    id: "e8", lang: "python",
    title: "Any number of arguments",
    brief: "Write <code>largest(*nums)</code>, which returns the largest of however many numbers it is given, or <code>None</code> if it is given none (section 5.3 &mdash; inside the function <code>nums</code> is a tuple; section 4.3 &mdash; <code>None</code>).<br>Do not use the built-in <code>max</code>: walk <code>nums</code> with a loop. Leave the lines below your function exactly as they are &mdash; the last one reads two numbers and calls <code>largest</code> with three arguments.",
    starter: "def largest(*nums):\n    # return the largest value in nums, or None if there are none\n    pass\n\nprint(largest(3, 9, 4))\nprint(largest(-5))\nprint(largest())\na = int(input())\nb = int(input())\nprint(largest(a, b, a + b))\n",
    solution: "def largest(*nums):\n    if len(nums) == 0:\n        return None\n    best = nums[0]\n    for n in nums:\n        if n > best:\n            best = n\n    return best\n\nprint(largest(3, 9, 4))\nprint(largest(-5))\nprint(largest())\na = int(input())\nb = int(input())\nprint(largest(a, b, a + b))\n",
    tests: [
      { stdin: "2\n5\n", expect: "9\n-5\nNone\n7\n" },
      { stdin: "-4\n-6\n", expect: "9\n-5\nNone\n-4\n" },
      { stdin: "10\n-3\n", expect: "9\n-5\nNone\n10\n" },
      { stdin: "0\n0\n", expect: "9\n-5\nNone\n0\n" }
    ]
  }
];
