/* Week 1 coding exercises — 41039 Programming 1.
 *
 * Every `expect` in this file was produced by RUNNING the solution through
 * P1Runtime (see architecture.md §Exercises). Never write one by hand: Java and
 * Python disagree about float formatting in ways that are easy to guess wrong.
 *
 * Shape: { id, lang, title, brief, starter, solution, tests: [{stdin, expect}] }
 */
window.WEEK_EXERCISES = [
  {
    id: 'e1', lang: 'java',
    title: 'Two lines of output',
    brief: 'Print exactly two lines: <code>Hello 41039!</code> then <code>I am learning Java.</code> ' +
           'Mind the capital letters and the full stop — the tests compare the output exactly.',
    starter: 'public class Hello {\n    public static void main(String[] args) {\n        // your code here\n    }\n}\n',
    solution: 'public class Hello {\n    public static void main(String[] args) {\n' +
              '        System.out.println("Hello 41039!");\n' +
              '        System.out.println("I am learning Java.");\n    }\n}\n',
    tests: [{ stdin: "", expect: "Hello 41039!\nI am learning Java.\n" }]
  },
  {
    id: 'e2', lang: 'java',
    title: 'Area of a rectangle',
    brief: 'Read two whole numbers — a width and a height, each on its own line — and print ' +
           '<code>Area: N</code>.',
    starter: 'import java.util.Scanner;\n\npublic class Area {\n    public static void main(String[] args) {\n' +
             '        Scanner input = new Scanner(System.in);\n        // read two ints, then print the area\n    }\n}\n',
    solution: 'import java.util.Scanner;\n\npublic class Area {\n    public static void main(String[] args) {\n' +
              '        Scanner input = new Scanner(System.in);\n' +
              '        int width = input.nextInt();\n        int height = input.nextInt();\n' +
              '        System.out.println("Area: " + (width * height));\n    }\n}\n',
    tests: [{ stdin: "4\n5\n", expect: "Area: 20\n" }, { stdin: "12\n3\n", expect: "Area: 36\n" }, { stdin: "1\n1\n", expect: "Area: 1\n" }]
  },
  {
    id: 'e3', lang: 'java',
    title: 'The division trap',
    brief: 'Read two whole numbers <code>a</code> and <code>b</code>. Print the <strong>integer</strong> ' +
           'division on the first line and the <strong>real</strong> division on the second:<br>' +
           '<code>Integer: 3</code><br><code>Real: 3.5</code><br>' +
           'This is the <code>7 / 2</code> trap from section 3 — one of these needs a <code>double</code>.',
    starter: 'import java.util.Scanner;\n\npublic class Divide {\n    public static void main(String[] args) {\n' +
             '        Scanner input = new Scanner(System.in);\n        int a = input.nextInt();\n' +
             '        int b = input.nextInt();\n\n        // print both kinds of division\n    }\n}\n',
    solution: 'import java.util.Scanner;\n\npublic class Divide {\n    public static void main(String[] args) {\n' +
              '        Scanner input = new Scanner(System.in);\n        int a = input.nextInt();\n' +
              '        int b = input.nextInt();\n\n' +
              '        System.out.println("Integer: " + (a / b));\n' +
              '        System.out.println("Real: " + ((double) a / b));\n    }\n}\n',
    tests: [{ stdin: "7\n2\n", expect: "Integer: 3\nReal: 3.5\n" }, { stdin: "9\n3\n", expect: "Integer: 3\nReal: 3.0\n" }, { stdin: "10\n4\n", expect: "Integer: 2\nReal: 2.5\n" }]
  },
  {
    id: 'e4', lang: 'python',
    title: 'Say hello back',
    brief: 'Read a name from the input and print <code>Hello, NAME!</code> — for example ' +
           '<code>Hello, Bach!</code>',
    starter: '# read a name and greet it\n',
    solution: 'name = input()\nprint("Hello, " + name + "!")\n',
    tests: [{ stdin: "Bach\n", expect: "Hello, Bach!\n" }, { stdin: "Linh\n", expect: "Hello, Linh!\n" }]
  },
  {
    id: 'e5', lang: 'python',
    title: 'Minutes and seconds',
    brief: 'Read a whole number of seconds and print it as minutes and seconds, like ' +
           '<code>3 min 25 sec</code>. You will want <code>//</code> and <code>%</code>.',
    starter: 'total = int(input())\n\n# print "<minutes> min <seconds> sec"\n',
    solution: 'total = int(input())\n\nminutes = total // 60\nseconds = total % 60\nprint(str(minutes) + " min " + str(seconds) + " sec")\n',
    tests: [{ stdin: "205\n", expect: "3 min 25 sec\n" }, { stdin: "60\n", expect: "1 min 0 sec\n" }, { stdin: "59\n", expect: "0 min 59 sec\n" }]
  },
  {
    id: 'e6', lang: 'java',
    title: 'Count the characters',
    brief: 'Read one whole line of text. Print it back, then print how many characters it has:<br>' +
           '<code>You typed: hello world</code><br><code>Characters: 11</code><br>' +
           'Remember that the space counts.',
    starter: 'import java.util.Scanner;\n\npublic class Counter {\n    public static void main(String[] args) {\n' +
             '        Scanner input = new Scanner(System.in);\n        String line = input.nextLine();\n\n' +
             '        // print the line, then its length\n    }\n}\n',
    solution: 'import java.util.Scanner;\n\npublic class Counter {\n    public static void main(String[] args) {\n' +
              '        Scanner input = new Scanner(System.in);\n        String line = input.nextLine();\n\n' +
              '        System.out.println("You typed: " + line);\n' +
              '        System.out.println("Characters: " + line.length());\n    }\n}\n',
    tests: [{ stdin: "hello world\n", expect: "You typed: hello world\nCharacters: 11\n" }, { stdin: "Programming 1\n", expect: "You typed: Programming 1\nCharacters: 13\n" }]
  }
];
