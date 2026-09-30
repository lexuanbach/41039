/* Week 4 quiz data — 41039 Programming 1.
   Consumed by assets/course.js via window.WEEK_DATA.
   Questions come from the Week 4 lessons on Ed (methods in Java, functions in Python,
   record classes) and from the page's sections 6 and 7 (the call stack and the heap;
   passing by value and by reference), which extend them.
   Every `code` snippet's behaviour was verified by actually running it: Java compiled
   with the site's own vendor/ecj.jar (records, which need Java 16+, with javac 26) and
   run on a JVM; Python on CPython 3.14. None of these answers is from memory.
   Distractors are written so that at least one is longer than the correct answer, so
   answer length is never a tell — and the correct option's position varies (A–D), because
   course.js does not shuffle options, so position must not be a tell either. */
window.WEEK_DATA = {
  id: 'week-4',
  quiz: [
    {
      q: 'What happens when you compile and run this?',
      lang: 'java',
      code: 'public class Q {\n    int twice(int x) {\n        return 2 * x;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(twice(4));\n    }\n}',
      opts: [
        'It prints <code>8</code>',
        'It prints <code>8</code>, because Java creates a <code>Q</code> object automatically when one is needed',
        'It does not compile: static <code>main</code> cannot call <code>twice</code> without an object',
        'It compiles, but crashes at run time because no <code>Q</code> object has been created yet'
      ],
      a: 2,
      why: '<code>twice</code> is not <code>static</code>, so it belongs to objects of <code>Q</code>, and <code>main</code> — which is static — has no object to call it on. The compiler catches that: <em>Cannot make a static reference to the non-static method</em> here, <em>cannot be referenced from a static context</em> on Ed. Java never creates the object for you, and because it is a compile error nothing ever runs. Either mark <code>twice</code> <code>static</code>, or write <code>new Q().twice(4)</code>.'
    },
    {
      q: 'Every <code>int</code> is either <code>&gt; 0</code> or <code>&lt;= 0</code>. So what does the compiler make of this method?',
      lang: 'java',
      code: 'public static String sign(int n) {\n    if (n > 0) return "positive";\n    if (n <= 0) return "not positive";\n}',
      opts: [
        'It is rejected: the compiler cannot prove that a <code>return</code> is always reached',
        'It is accepted, because between them the two conditions cover every possible <code>int</code>',
        'It is accepted, but <code>sign(0)</code> returns <code>null</code> because neither branch is taken',
        'It is rejected, because a method is only allowed to contain a single <code>return</code> statement'
      ],
      a: 0,
      why: 'The compiler does a simple flow analysis: it does not reason about what the two conditions cover, only that each <code>if</code> might be false — so there is a path that falls off the end. ECJ: <em>This method must return a result of type String</em>; <code>javac</code>: <em>missing return statement</em>. Several <code>return</code>s are perfectly legal. The fix is an <code>else</code>, or a final unconditional <code>return</code>.'
    },
    {
      q: 'What does <code>countTo(3)</code> print?',
      lang: 'java',
      code: 'public static void countTo(int n) {\n    for (int i = 1; i <= 10; i++) {\n        if (i > n) return;\n        System.out.print(i + " ");\n    }\n    System.out.print("done");\n}',
      opts: [
        '<code>1 2 3 done</code>, because <code>return</code> only leaves the loop, like <code>break</code>',
        'Nothing: a <code>void</code> method is not allowed to contain a <code>return</code> statement',
        '<code>1 2 3 4 5 6 7 8 9 10 done</code>, since the <code>return</code> has no value to give back',
        '<code>1 2 3 </code>'
      ],
      a: 3,
      why: 'In a <code>void</code> method, <code>return;</code> (with no value) ends the <em>whole method</em> immediately — not just the loop — so <code>done</code> is never printed. That is the "stop early" use from section 2.4. It is <code>break</code> that leaves only the loop.'
    },
    {
      q: 'What does this print?',
      lang: 'java',
      code: 'public static void show(int x)    { System.out.println("int " + x); }\npublic static void show(double x) { System.out.println("double " + x); }\npublic static void show(String x) { System.out.println("String " + x); }\n\n// in main:\nshow(5);\nshow(5.0);\nshow("5");',
      opts: [
        'It does not compile: three methods in one class cannot share the name <code>show</code>',
        '<code>int 5</code>, <code>double 5.0</code>, <code>String 5</code> on three lines',
        '<code>String 5</code> three times, because <code>+</code> turns every argument into a String',
        '<code>int 5</code> three times, because the first matching <code>show</code> always wins'
      ],
      a: 1,
      why: 'This is overloading: one name, different parameter lists, and Java picks the version whose parameter types match the arguments. <code>5</code> is an <code>int</code>, <code>5.0</code> a <code>double</code> (which prints as <code>5.0</code>), <code>"5"</code> a String. It is exactly how <code>System.out.println</code> manages to have ten versions.'
    },
    {
      q: 'What does the compiler do with this method?',
      lang: 'java',
      code: 'public static int add(int a, int b = 0) {\n    return a + b;\n}',
      opts: [
        'Accepts it, so <code>add(5)</code> returns 5 and <code>add(5, 2)</code> returns 7',
        'Rejects it: Java does not allow default values for parameters',
        'Accepts it, but ignores the <code>= 0</code>, so <code>add(5)</code> is still a compile error',
        'Accepts it, but only if the method is also marked <code>static</code> and <code>final</code>'
      ],
      a: 1,
      why: 'Unlike Python (and several other languages), Java has no default parameter values — the header itself is a syntax error. In Java the usual way to get the same effect is overloading: a second <code>add(int a)</code> that calls <code>add(a, 0)</code>.'
    },
    {
      q: 'What does this print?',
      lang: 'java',
      code: 'public static int count(String... words) {\n    return words.length;\n}\n\n// in main:\nSystem.out.println(count() + count("a", "b") + count("c"));',
      opts: [
        '<code>021</code>, because the three results are joined together as text',
        'It does not compile: <code>count()</code> must be given at least one argument',
        '<code>2</code>, because the call with no arguments throws an exception that is skipped',
        '<code>3</code>'
      ],
      a: 3,
      why: 'A varargs parameter accepts any number of arguments — including zero — and arrives as an array, so <code>words.length</code> is 0, 2 and 1. Those are <code>int</code>s, so <code>+</code> adds them: 3. There is no String anywhere in the expression for <code>+</code> to concatenate.'
    },
    {
      q: 'Which of these is a <strong>pure function</strong> in the sense of the Ed lesson?',
      opts: [
        '<code>static int square(int x) { return x * x; }</code>',
        '<code>static void square(int x) { System.out.println(x * x); }</code>',
        '<code>static int next() { counter = counter + 1; return counter; }</code>',
        '<code>static int readSquare(Scanner sc) { int x = sc.nextInt(); return x * x; }</code>'
      ],
      a: 0,
      why: 'A pure function has no side effects and no hidden inputs: same arguments, same result, nothing else changed. Printing is a side effect (the <code>void</code> one is a procedure). <code>next</code> changes a variable outside itself and returns something different every call. <code>readSquare</code> has a hidden input — whatever the user types — so the same argument can give different results.'
    },
    {
      q: 'What does this print?',
      lang: 'python',
      code: "def add(a, b):\n    return a + b\n\nprint(add('3', '4'))",
      opts: [
        '<code>7</code>, because Python converts both strings to numbers first',
        'Nothing: it raises a <code>TypeError</code> because <code>add</code> expects numbers',
        '<code>34</code>',
        "<code>'3''4'</code>, because the strings keep their quotes when they are joined"
      ],
      a: 2,
      why: 'Nothing in a Python function header says what types it expects, so the strings go straight in, and <code>+</code> on two strings joins them. <code>print</code> shows a string without quotes. Python never converts <code>\'3\'</code> to a number unless you ask with <code>int()</code>.'
    },
    {
      q: 'What does this print?',
      lang: 'python',
      code: 'def double(x):\n    print(x * 2)\n\ny = double(5)\nprint(y)',
      opts: [
        '<code>10</code>, then <code>10</code> again, because <code>y</code> holds what was printed',
        'Just <code>10</code>: the second <code>print</code> shows nothing, because <code>y</code> is empty',
        'An error, because a function without a <code>return</code> cannot be assigned to a variable',
        '<code>10</code>, then <code>None</code>'
      ],
      a: 3,
      why: 'Printing a value is not returning it. <code>double</code> prints 10, then finishes without a <code>return</code> — and a Python function that does that returns <code>None</code>. So <code>y</code> is <code>None</code>, and <code>print(y)</code> prints the word <code>None</code>. That is Python&rsquo;s version of a <code>void</code> method.'
    },
    {
      q: 'What does this print?',
      lang: 'python',
      code: 'def half(n: int) -> int:\n    return n / 2\n\nprint(half(5))',
      opts: [
        '<code>2</code>, because the <code>-&gt; int</code> hint converts the result to an int',
        '<code>2.5</code>',
        'It raises a <code>TypeError</code>, because the function returns a float and not an int',
        'It fails before running, because the type hints do not match what the body computes'
      ],
      a: 1,
      why: 'Type hints are not enforced — not when the function is defined, not when it is called, not when it returns. <code>/</code> in Python always produces a float, so the result is 2.5 despite the <code>-&gt; int</code>. PEP 484 promised that hints would never become mandatory.'
    },
    {
      q: 'What does this print?',
      lang: 'python',
      code: 'def greet(name, greeting="Hello"):\n    print(greeting + ", " + name)\n\ngreet("An")\ngreet("Binh", "Chao")\ngreet(greeting="Hi", name="Cuong")',
      opts: [
        '<code>Hello, An</code> / <code>Hello, Binh</code> / <code>Hello, Cuong</code>, since the default always applies',
        '<code>Hello, An</code> / <code>Chao, Binh</code>, then an error because the last call has the arguments out of order',
        '<code>Hello, An</code> / <code>Chao, Binh</code> / <code>Hi, Cuong</code>',
        'An error on the first call, because <code>greet</code> needs two arguments and has been given only one'
      ],
      a: 2,
      why: 'The default is used only when the argument is left out (the first call); a supplied argument replaces it (the second). In the third call both arguments are given <em>by name</em>, so their order does not matter.'
    },
    {
      q: 'What happens when this runs?',
      lang: 'python',
      code: 'def msg(*names, msg):\n    for name in names:\n        print(msg + ", " + name)\n\nmsg("Luke", "Cat", "Hi")',
      opts: [
        'A <code>TypeError</code>: <code>msg</code> was never given, because <code>*names</code> took all three',
        'It prints <code>Hi, Luke</code> and <code>Hi, Cat</code>, because the last argument goes to <code>msg</code>',
        'It prints <code>Luke, Cat</code> and <code>Luke, Hi</code>, because the first argument goes to <code>msg</code>',
        'Nothing at all, because a parameter cannot have the same name as the function it belongs to'
      ],
      a: 0,
      why: '<code>*names</code> collects <em>every</em> positional argument, so all three strings end up in <code>names</code> and nothing is left for <code>msg</code>. A parameter after <code>*names</code> can only be given by keyword — <code>msg="Hi"</code> — and Python says so: <em>missing 1 required keyword-only argument: \'msg\'</em>.'
    },
    {
      q: 'What does this print?',
      lang: 'python',
      code: 'def record(**data):\n    print(len(data), data["job"])\n\nrecord(name="Luke", job="Lecturer")',
      opts: [
        '<code>2 Lecturer</code>',
        '<code>1 Lecturer</code>, because <code>name</code> is kept separate from the rest of the data',
        'A <code>TypeError</code>, because <code>record</code> has no parameters called <code>name</code> or <code>job</code>',
        '<code>2 job</code>, because <code>**data</code> collects the parameter names but not their values'
      ],
      a: 0,
      why: '<code>**data</code> collects every named argument that does not match a parameter into a <code>dict</code>: here <code>{\'name\': \'Luke\', \'job\': \'Lecturer\'}</code>. It has two entries, and looking up the key <code>"job"</code> gives the value <code>Lecturer</code>.'
    },
    {
      q: 'In section 6.1&rsquo;s <code>CallStack</code> program, <code>main</code> calls <code>printFactors(n)</code>, which calls <code>isFactor(i, n)</code>. While <code>isFactor(3, 4)</code> is running, which statement is true?',
      opts: [
        'There is one frame shared by all three methods, so the three variables called <code>n</code> are really one variable',
        'Only <code>isFactor</code> has a frame, because <code>main</code> and <code>printFactors</code> lose theirs when they make a call',
        'There are three frames on the stack, each with its own variables, and <code>isFactor</code>&rsquo;s is on top',
        '<code>isFactor</code>&rsquo;s frame is at the bottom of the stack, because the most recent call goes underneath the others'
      ],
      a: 2,
      why: 'Every call pushes a new frame holding that call&rsquo;s parameters and local variables, and the callers&rsquo; frames stay below it, waiting — which is how they carry on where they left off. So <code>main</code>, <code>printFactors</code> and <code>isFactor</code> each have their own <code>n</code>. The newest frame is always on top, and it is popped when that method returns.'
    },
    {
      q: 'In section 6.3, <code>squares(5)</code> creates <code>int[] result = new int[n]</code> and returns it. After it returns, why can <code>main</code> still use the array?',
      opts: [
        'Java copies the whole array, element by element, into <code>main</code>&rsquo;s frame at the moment the method returns to its caller',
        'The array was allocated on the heap, and <code>main</code> now holds a reference to it; only the frame was destroyed',
        'The frame of <code>squares</code> stays on the stack until <code>main</code> ends, so <code>result</code> is still there',
        'Arrays are automatically <code>static</code>, so they belong to the class rather than to any one method call'
      ],
      a: 1,
      why: 'Frames hold parameters and local variables; arrays and objects live on the heap. <code>result</code> was a local variable holding a <em>reference</em>, and it disappeared with the frame — but <code>return result</code> handed a copy of that reference to <code>main</code>, so the array itself is still reachable. Nothing is copied element by element.'
    },
    {
      q: 'What does this print?',
      lang: 'java',
      code: 'public static void swap(int a, int b) {\n    int temp = a;\n    a = b;\n    b = temp;\n}\n\n// in main:\nint x = 1;\nint y = 2;\nswap(x, y);\nSystem.out.println(x + " " + y);',
      opts: [
        '<code>2 1</code>, because <code>swap</code> exchanges the two variables it is given',
        '<code>2 2</code>, because <code>a = b</code> runs before <code>temp</code> can be copied back',
        'It does not compile, because <code>a</code> and <code>b</code> are assigned new values inside the method',
        '<code>1 2</code>'
      ],
      a: 3,
      why: 'Java passes arguments by value: <code>a</code> and <code>b</code> are new variables in <code>swap</code>&rsquo;s frame, initialised with copies of 1 and 2. They are swapped correctly — and then the frame is popped. <code>x</code> and <code>y</code> were never touched. Assigning to parameters is legal; it just cannot reach the caller.'
    },
    {
      q: 'What does this print?',
      lang: 'java',
      code: 'public static void grow(int[] a) {\n    a = new int[] {1, 2, 3, 4};\n    a[0] = 100;\n}\n\n// in main:\nint[] v = {9};\ngrow(v);\nSystem.out.println(v.length + " " + v[0]);',
      opts: [
        '<code>4 100</code>, because arrays are passed by reference, so <code>v</code> now refers to the new array',
        '<code>1 100</code>, because the length cannot change but the element can still be written through <code>a</code>',
        '<code>1 9</code>',
        '<code>4 1</code>, because the new array replaces the old one but <code>a[0] = 100</code> is lost on return'
      ],
      a: 2,
      why: '<code>a</code> starts as a copy of the reference in <code>v</code>. The first line <em>rebinds</em> <code>a</code> to a brand-new array, so <code>a[0] = 100</code> changes that new array, not <code>v</code>&rsquo;s. <code>v</code> still refers to the original one-element array holding 9. If Java really passed arrays by reference, <code>4 100</code> would be right — it does not.'
    },
    {
      q: 'What does this print?',
      lang: 'java',
      code: 'public static void shout(String s) {\n    s = s + "!";\n}\n\n// in main:\nString word = "hi";\nshout(word);\nSystem.out.println(word);',
      opts: [
        '<code>hi!</code>, because a String is an object, so changes made in the method are visible',
        '<code>!</code>, because <code>s + "!"</code> replaces the contents of the String with the new text',
        'It does not compile, because a String parameter cannot appear on the left of an assignment',
        '<code>hi</code>'
      ],
      a: 3,
      why: '<code>s + "!"</code> builds a <em>new</em> String, and <code>s = …</code> rebinds the parameter to it — a rebind, which the caller never sees. And there is no way to mutate a String instead: Strings in Java (and in Python) are immutable. Being an object only helps when the method changes the object itself, like <code>values[i] = …</code> on an array.'
    },
    {
      q: 'Which statement about passing arguments in Java is accurate?',
      opts: [
        'Java always passes by value; for arrays and objects, the value copied is a reference',
        'Java passes primitive values by value, but passes arrays and objects by reference',
        'Java passes everything by reference, which is why a method can change an array it is given',
        'Java passes by value only for <code>static</code> methods, and by reference for all other methods'
      ],
      a: 0,
      why: 'The Java Language Specification: the values of the argument expressions "initialize newly created parameter variables". For an array or object the value is a reference, so the method can follow it and change the shared object — but reassigning the parameter never affects the caller, and a <code>swap(int, int)</code> cannot work. That is call by value of references, not call by reference.'
    },
    {
      q: 'What does this print?',
      lang: 'python',
      code: 'def bump(n):\n    n = n + 1\n    return n\n\nx = 5\nbump(x)\nprint(x)',
      opts: [
        '<code>6</code>, because <code>bump</code> adds one to <code>x</code> and returns it',
        '<code>5</code>',
        '<code>6</code>, because the parameter <code>n</code> and the variable <code>x</code> are the same variable',
        'An error, because the value returned by <code>bump(x)</code> is never stored anywhere'
      ],
      a: 1,
      why: 'An <code>int</code> is immutable, so <code>n = n + 1</code> makes a new number and rebinds the local <code>n</code>; <code>x</code> still refers to 5. <code>bump</code> does <em>return</em> 6 — but the caller throws it away. To keep it, write <code>x = bump(x)</code>. Ignoring a return value is allowed, just rarely what you meant.'
    },
    {
      q: 'What does this print?',
      lang: 'python',
      code: 'def fill(box):\n    box = box + [1]\n    box.append(2)\n\nstuff = []\nfill(stuff)\nprint(stuff)',
      opts: [
        '<code>[1, 2]</code>, because a list passed to a function can be changed by that function',
        '<code>[]</code>',
        '<code>[2]</code>, because the append changes the caller&rsquo;s list but the <code>+</code> does not',
        '<code>[1]</code>, because the <code>+</code> changes the caller&rsquo;s list but the append does not'
      ],
      a: 1,
      why: '<code>box + [1]</code> builds a <em>new</em> list, and <code>box = …</code> rebinds the local name to it before anything else happens. From then on every change — including the <code>append</code> — goes to the new list. <code>stuff</code> was never mutated, so it is still empty.'
    },
    {
      q: 'And this one?',
      lang: 'python',
      code: 'def fill(box):\n    box += [1]\n\nstuff = []\nfill(stuff)\nprint(stuff)',
      opts: [
        '<code>[1]</code>',
        '<code>[]</code>, because <code>box += [1]</code> means exactly the same as <code>box = box + [1]</code>',
        '<code>[]</code>, because anything assigned inside a function is forgotten when it returns',
        'An error, because <code>+=</code> can only be used on numbers and not on lists'
      ],
      a: 0,
      why: 'The trap from section 7.5: for a list, <code>+=</code> <em>mutates the list in place</em> — so the caller&rsquo;s <code>stuff</code> changes. It is not the same as <code>box = box + [1]</code>, which builds a new list (previous question). On an immutable <code>int</code>, <code>+=</code> has no choice but to make a new object, which is why <code>add3</code> in the Ed lesson changes nothing.'
    },
    {
      q: 'What does this print?',
      lang: 'java',
      code: 'public class Q {\n    record Point(double x, double y) {}\n\n    public static void main(String[] args) {\n        Point p = new Point(1.5, -3.2);\n        System.out.println(p);\n    }\n}',
      opts: [
        'Something like <code>Q$Point@1b6d3586</code>, since the record has no printing method written',
        '<code>(1.5, -3.2)</code>, because a record prints exactly like a Python tuple does',
        'It does not compile, because a record has to be declared in a file of its own',
        '<code>Point[x=1.5, y=-3.2]</code>'
      ],
      a: 3,
      why: 'A record comes with a readable printed form for free: its name, then each component and value in square brackets. Only a <em>public</em> record needs its own file; this one is nested in <code>Q</code>. (This needs Java 16 or later — run it on Ed, not in this page&rsquo;s console.)'
    },
    {
      q: 'Given <code>record Point(double x, double y) {}</code> and <code>Point p = new Point(1.5, -3.2);</code>, what happens with <code>p.x = 10;</code>?',
      opts: [
        'It sets <code>x</code> to 10.0, because every record automatically comes with public variables',
        'It compiles, but throws an exception at run time, because records are checked when the program runs',
        'A compile error: the component cannot be reassigned; you can only read it, with <code>p.x()</code>',
        'It creates a brand new <code>Point</code> with <code>x</code> equal to 10.0 and stores that in <code>p</code>'
      ],
      a: 2,
      why: 'A record gives you a method to <em>read</em> each component — <code>p.x()</code>, with brackets — but nothing to change it: the variables are <code>final</code>. <code>javac</code> says <em>cannot assign a value to final variable x</em>. That is what makes a simple record so like a Python tuple: build it once, read it as often as you like.'
    }
  ]
};
