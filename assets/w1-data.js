/* Week 1 quiz data — 41039 Programming 1.
   Consumed by assets/course.js via window.WEEK_DATA.
   Every question comes from the Week 1 lessons on Ed / the Week 1 lecture.
   Distractors are written at least as long as the correct answer, so answer
   length is never a tell. */
window.WEEK_DATA = {
  id: 'week-1',
  quiz: [
    {
      q: 'At the simplest level, what is programming?',
      opts: [
        'Telling a computer what to do',
        'Writing zeroes and ones directly into a computer’s memory by hand',
        'Designing the physical circuits that a computer is built from',
        'Translating an existing program from one language into another'
      ],
      a: 0,
      why: 'Writing zeroes and ones was how it was once done, but that is a historical stage, not the definition. Circuit design is hardware, not programming.'
    },
    {
      q: 'In 1954 John Backus developed FORTRAN. What changed for programmers?',
      opts: [
        'They could care more about <em>what</em> to do than exactly <em>how</em> to do it',
        'Programs stopped containing errors, because the compiler checked everything first',
        'Computers became able to execute more than one instruction at the same time',
        'Programs could finally be stored in memory instead of being rewired by hand'
      ],
      a: 0,
      why: 'FORTRAN raised the level of abstraction. It did not eliminate errors, and stored-program computers already existed.'
    },
    {
      q: 'What are the three basic tools underlying every general-purpose language?',
      opts: [
        'State, branching and repetition',
        'Classes, methods and inheritance, arranged into nested blocks',
        'Compilation, interpretation and garbage collection of unused memory',
        'Variables, functions and comments that document what the code does'
      ],
      a: 0,
      why: 'Add basic input and output to state, branching and repetition and you have everything needed for a general-purpose language. This is SLO1.'
    },
    {
      q: 'Weeks 6 to 11 cover classes, methods, lists, files and inheritance. What do they add?',
      opts: [
        'No fourth idea — they are ways of organising the same three as programs grow',
        'A fourth basic tool, which is needed once programs get past a certain size',
        'Replacements for state and branching that scale better in larger programs',
        'The input and output facilities that the first three tools deliberately leave out'
      ],
      a: 0,
      why: 'The central point of the subject structure: Weeks 6–11 are about organisation, not new primitives.'
    },
    {
      q: 'Which one of these is a <em>rule</em> in Java, not merely a convention?',
      opts: [
        'Java is case sensitive, so <code>bob</code> and <code>Bob</code> are different names',
        'Class names start with an uppercase letter and variable names start lowercase',
        'You indent your code every time you open a new block of statements',
        'Constants are written in all capitals with underscores between the words'
      ],
      a: 0,
      why: 'The other three are conventions — universally followed, but not enforced by the compiler. Case sensitivity is enforced.'
    },
    {
      q: 'A file contains <code>public class HelloWorld</code>. What must the file be called?',
      opts: [
        '<code>HelloWorld.java</code>',
        '<code>helloworld.java</code>, since Java lowercases file names automatically',
        'Anything ending in <code>.java</code> — the class name inside is what matters',
        '<code>main.java</code>, because that is where execution of the program starts'
      ],
      a: 0,
      why: 'The file name must match the public class name exactly, including case. Ed manages files for you, so you may not notice until you compile locally.'
    },
    {
      q: 'For a piece of Java code to be runnable, it needs a method with which signature?',
      opts: [
        '<code>public static void main(String[] args)</code>',
        '<code>public void main(String args)</code>, with a single String parameter',
        '<code>static int main()</code>, returning zero when the program succeeds',
        '<code>public class main(String[] args)</code>, declared at the top level'
      ],
      a: 0,
      why: 'Exactly this signature. For now, copy it precisely — execution always starts there. <code>public</code>, <code>static</code> and <code>void</code> are explained in Week 7.'
    },
    {
      q: 'What does this Java program print?',
      lang: 'java',
      code: 'int a = 8;\nint b = 7;\nint c = a * b;\nSystem.out.println("c = " + c);',
      opts: [
        'c = 56',
        'c = 15, because + adds the two numbers before printing them',
        '"c = " + c, printed literally with the quotation marks included',
        'Nothing — it will not compile, because you cannot add a String to an int'
      ],
      a: 0,
      why: 'The <code>+</code> here is not addition. When one side is a String, <code>+</code> joins them together, converting the <code>int</code> to text.'
    },
    {
      q: 'What is the value of <code>7 / 2</code> in Java?',
      opts: [
        '3',
        '3.5, the same value that a calculator would give you for this division',
        '4, because the result is rounded to the nearest whole number',
        'A compile error, since dividing two ints cannot produce a fraction'
      ],
      a: 0,
      why: 'Integer divided by integer gives an integer, and the fractional part is discarded rather than rounded. Use <code>7.0 / 2</code> to get <code>3.5</code>.'
    },
    {
      q: 'In <code>boolean b = true;</code> the word <code>boolean</code> and the name <code>b</code> together form what?',
      opts: [
        'A declaration, and <code>= true</code> makes it an initialisation as well',
        'An assignment, which is the same operation repeated later in the program',
        'An initialisation only — the declaration happened when the class was written',
        'A type conversion from the literal <code>true</code> into a boolean variable'
      ],
      a: 0,
      why: 'Declaration = a type followed by a name. Initialisation = the <em>first</em> assignment of a value. Assignment = storing a value in an existing variable.'
    },
    {
      q: 'As mathematics <code>a = a + 1</code> is false for every <em>a</em>. What does it mean in Java?',
      opts: [
        'Take the value of <code>a + 1</code> and store it in <code>a</code>',
        'Assert that <code>a</code> and <code>a + 1</code> are the same value, which fails',
        'Compare <code>a</code> with <code>a + 1</code> and produce <code>false</code>',
        'Declare a new variable called <code>a</code> whose value is one larger'
      ],
      a: 0,
      why: 'Read assignment right to left, out loud, every time: <em>take the thing on the right, put it in the thing on the left</em>.'
    },
    {
      q: 'What does this print?',
      lang: 'java',
      code: 'String s = "Hello World";\nSystem.out.println(s.length());',
      opts: [
        '11',
        '10, because the space between the two words is not a character',
        '13, since the two quotation marks are part of the String value',
        '2, which is the number of words that the String contains'
      ],
      a: 0,
      why: '<code>"Hello World"</code> is 11 characters — the space counts. The quotes mark the value in your source code; they are not part of it.'
    },
    {
      q: 'In <code>System.out.println(...)</code>, what is <code>out</code>?',
      opts: [
        'A variable inside the <code>System</code> class, reached with the dot operator',
        'A method of the <code>System</code> class that returns the screen to print on',
        'A reserved keyword in Java that always means standard output',
        'The name of the file that the text will eventually be written into'
      ],
      a: 0,
      why: '<code>System</code> is a class, <code>.out</code> is a variable inside it, and <code>.println(...)</code> is a method called on <code>out</code>. Three ordinary things, not a magic incantation.'
    },
    {
      q: 'What happens when you compile this Java?',
      lang: 'java',
      code: 'String s;\n\nSystem.out.println(s);',
      opts: [
        'It refuses to compile: variable <code>s</code> might not have been initialized',
        'It compiles and prints <code>null</code>, the reference that points at nothing',
        'It compiles and prints an empty line, since a String starts out empty',
        'It compiles but throws a NullPointerException as soon as it is run'
      ],
      a: 0,
      why: 'Java is strict about <em>local</em> variables and protects you here. It will not always protect you — in other places an uninitialised object variable gets <code>null</code>.'
    },
    {
      q: 'Why is the Python version of Hello World a single line, when Java needs six?',
      opts: [
        'Python allows code outside of classes; Java requires everything inside one',
        'Python automatically generates the missing class and main method for you behind the scenes',
        'Java is older, so it carries syntax that later languages were able to drop',
        'The Java version shown includes optional lines that can safely be removed'
      ],
      a: 0,
      why: 'Java’s extra ceremony is not pointless — it buys the ability to detect certain errors before the program runs. The two languages made different bets.'
    },
    {
      q: 'What does this Python print?',
      lang: 'python',
      code: 'a = input("Enter a number: ")\nif int(a) < 10:\n    pass\nprint("It\'s less than 10!")',
      opts: [
        'The message always, whatever number is entered',
        'The message only when the number entered is less than 10',
        'Nothing at all, because <code>pass</code> ends the program early',
        'An IndentationError, since the <code>if</code> block does no real work'
      ],
      a: 0,
      why: 'The <code>print</code> is not indented, so it is not inside the <code>if</code>. Only the indentation changed — and in Python the indentation <em>is</em> the block.'
    },
    {
      q: 'Which statement about types in Python is correct?',
      opts: [
        'Variables do not have a type, but the data still does',
        'Neither the variables nor the data carry a type until the program runs',
        'Variables have a type, but it may be changed later in the program',
        'Both variables and data are typed, exactly as they are in Java'
      ],
      a: 0,
      why: 'That single difference is what “dynamically typed” means. Java fixes and checks types before the program runs; Python attaches them to values instead.'
    },
    {
      q: 'Which kind of error gives you no message at all?',
      opts: [
        'A logic error — the program runs perfectly and does the wrong thing',
        'A run-time error, which crashes the program without printing anything',
        'A compile-time error, when the compiler cannot work out what you meant',
        'An indentation error in Python, which the interpreter silently ignores'
      ],
      a: 0,
      why: 'Compile-time and run-time errors both tell you. The logic error is the dangerous one precisely because it is silent — nothing is going to warn you.'
    },
    {
      q: 'You get 14 compile errors. What should you do?',
      opts: [
        'Fix the first one and recompile',
        'Read all fourteen carefully before changing anything in the code',
        'Start from the last error, since it is furthest from what you just typed',
        'Reset the exercise to the scaffold and write the whole thing again'
      ],
      a: 0,
      why: 'One small bug often produces many messages — the further your code is from valid Java, the more confused the compiler gets. Errors 2 through 14 are usually downstream of error 1.'
    },
    {
      q: 'Java puts the error type first in its message. Where does Python put it?',
      opts: [
        'Last — so in a Python traceback you read the final line first',
        'First as well, which makes the two languages easy to read together',
        'In the middle, between the file name and the line that caused it',
        'Nowhere — Python reports only the line number and the source line'
      ],
      a: 0,
      why: 'A Python traceback ends with <code>TypeError: ...</code> or similar. The lines above it are the path that led there.'
    }
  ]
};
