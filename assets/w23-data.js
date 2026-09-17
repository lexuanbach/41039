/* Weeks 2 & 3 quiz data — 41039 Programming 1.
   Consumed by assets/course.js via window.WEEK_DATA.
   Every question comes from the Week 2+3 lessons on Ed.
   Every `code` snippet's output was verified by actually compiling it with the
   site's own vendor/ecj.jar and running it (Java), or running it on CPython
   (Python) — none of these answers is from memory.
   Distractors are written at least as long as the correct answer, so answer
   length is never a tell. */
window.WEEK_DATA = {
  id: 'week-2-3',
  quiz: [
    {
      q: 'What happens when you compile this?',
      lang: 'java',
      code: 'public class Q {\n    public static void main(String[] args) {\n        boolean b = 10 + 3;\n    }\n}',
      opts: [
        'It fails: <code>10 + 3</code> is an expression of type <code>int</code>',
        'It compiles, and <code>b</code> becomes <code>true</code> because 13 is not zero',
        'It compiles, but throws a <code>ClassCastException</code> when the program is run',
        'It compiles with a warning, and <code>b</code> is left at its default value of <code>false</code>'
      ],
      a: 0,
      why: 'Expressions have types in Java, just like variables and methods do — and the type of <code>10 + 3</code> is <code>int</code>, which is not compatible with <code>boolean</code>. ECJ says <em>Type mismatch: cannot convert from int to boolean</em>. The "non-zero is true" rule is C and C++, not Java, and nothing here survives to run time.'
    },
    {
      q: 'This is valid C++ but rejected by Java. Why does Java refuse it?<br><code>boolean b = true; int i = 10 + b;</code>',
      opts: [
        'In Java <code>boolean</code> is its own type and is not compatible with the numeric types',
        'Java evaluates the right-hand side first, and by then <code>b</code> has gone out of scope',
        'Java requires an explicit cast here, so <code>int i = 10 + (int) b;</code> would fix it',
        'Java only allows <code>+</code> between two operands when at least one of them is a String'
      ],
      a: 0,
      why: 'Java is strongly statically typed, and <code>boolean</code> deliberately does not convert to a number. C++ will happily add <code>true</code> as 1. There is no cast that rescues it either — <code>(int) b</code> is itself a compile error.'
    },
    {
      q: 'What does this print?',
      lang: 'java',
      code: 'int i = 50;\nif (i < 100) {\n    System.out.println("less than 100");\n    i = 101;\n}\nif (i > 100) {\n    System.out.println("greater than 100");\n}',
      opts: [
        'Both lines',
        'Only <code>less than 100</code>, because <code>i</code> started below 100',
        'Only <code>greater than 100</code>, because <code>i</code> ends up as 101',
        'Neither line, because the second <code>if</code> re-reads the original value of <code>i</code>'
      ],
      a: 0,
      why: 'This is the trap in two separate <code>if</code> statements: the first block changed <code>i</code> to 101, and the second condition is then tested against the <em>new</em> value. An <code>if</code>/<code>else</code> makes the two branches genuinely exclusive; two separate <code>if</code>s do not.'
    },
    {
      q: 'What does this print?',
      lang: 'java',
      code: 'int i = 42;\nif (i == 42)       System.out.println("the answer");\nelse if (i < 100)  System.out.println("less than 100");\nelse if (i == 100) System.out.println("exactly 100");\nelse               System.out.println("more than 100");',
      opts: [
        '<code>the answer</code>',
        '<code>the answer</code> followed by <code>less than 100</code>, since both are true',
        '<code>less than 100</code>, because the ladder always tests the numeric ranges first',
        'Nothing at all, because the cases overlap and Java cannot decide between them'
      ],
      a: 0,
      why: 'The conditions are tested in the order written, and the ladder stops at the first one that is true — so a specific case put <em>before</em> an overlapping general case wins. Put <code>i == 42</code> last and you would never reach it.'
    },
    {
      q: 'What does this print?',
      lang: 'java',
      code: 'int x = 2;\nswitch (x) {\n    case 1 : System.out.println("The value is 1.");\n    case 2 : System.out.println("The value is 2.");\n    case 3 : System.out.println("The value is 3.");\n    default : System.out.println("The value is not 1, 2 or 3.");\n}',
      opts: [
        'Three lines, starting at <code>The value is 2.</code>',
        'One line, <code>The value is 2.</code>, because only the matching case runs',
        'One line, <code>The value is not 1, 2 or 3.</code>, because <code>default</code> always runs last',
        'Four lines, because a switch with no breaks runs every case from the top down'
      ],
      a: 0,
      why: 'This is <strong>fall-through</strong>. A switch finds the matching case, starts there, and keeps going until it hits a <code>break</code> or the end of the block — so it prints cases 2, 3 and <code>default</code>. It starts at the match, not at the top, which rules out four lines.'
    },
    {
      q: 'Which of these can you <code>switch</code> on in Java?',
      opts: [
        '<code>int</code>, <code>String</code> and <code>char</code>',
        'Any type at all, as long as every case label is a compile-time constant',
        'Only the numeric primitive types, which is why <code>String</code> needs an if-ladder',
        '<code>boolean</code>, plus anything that can be converted to <code>true</code> or <code>false</code>'
      ],
      a: 0,
      why: 'The switchable types are <code>byte</code>, <code>short</code>, <code>char</code>, <code>int</code> and <code>String</code>, plus enums and — more recently — object types via pattern matching. <code>String</code> definitely works. Switching on the remaining primitives is still a preview feature.'
    },
    {
      q: 'What is the practical difference between Python&rsquo;s <code>match</code> and Java&rsquo;s <code>switch</code>?',
      opts: [
        '<code>match</code> has no fall-through, so it needs no <code>break</code>',
        '<code>match</code> can only test integers, while a Java <code>switch</code> also accepts Strings',
        '<code>match</code> tests every case and runs all of the ones that happen to match the subject',
        '<code>match</code> is evaluated at compile time, so its subject has to be a constant expression'
      ],
      a: 0,
      why: 'Python&rsquo;s <code>match</code> (new in 3.10) draws on functional-language pattern matching rather than C&rsquo;s "fancy jump", so only the matching block runs and there is no <code>break</code>. To group cases you write <code>case 1 | 5 | 87:</code> instead of stacking bare labels.'
    },
    {
      q: 'In Python, what does <code>case 1 | 5 | 87 | 120:</code> mean?',
      opts: [
        'Match if the subject is any one of those four values',
        'Match only if the subject equals the bitwise OR of all four of those values',
        'Match the first value, then fall through the remaining three unless a break stops it',
        'Match if the subject is a list that contains all four of those values in that order'
      ],
      a: 0,
      why: 'In a <code>case</code> pattern the <code>|</code> is an alternation operator, not the bitwise OR, so this is the compact way to give one case several matching values. It is how you replace the deliberate stacked-label trick from a Java switch.'
    },
    {
      q: 'When should you reach for a <code>while</code> loop rather than a <code>for</code> loop?',
      opts: [
        'When you do not know in advance how many iterations it will take',
        'When you need the loop body to run at least once before the condition is checked',
        'When the loop has to modify the variable that its own stopping condition depends on',
        'When performance matters, because a <code>while</code> loop compiles to fewer instructions'
      ],
      a: 0,
      why: 'The two are functionally interchangeable — any <code>for</code> converts to a <code>while</code> and back — so the choice is about telling the reader what to expect. Index-driven counting reads better as a <code>for</code>; an unknown number of steps, like reading user input until they stop, reads better as a <code>while</code>. "At least once" is the <code>do-while</code>, and there is no speed difference.'
    },
    {
      q: 'What does this print?',
      lang: 'java',
      code: 'int count = 0;\nfor (int i = 2048; i > 1; i /= 2) {\n    count++;\n}\nSystem.out.println(count);',
      opts: [
        '<code>11</code>',
        '<code>12</code>, counting 2048 itself and every halving down to and including 1',
        '<code>2047</code>, because the loop variable is decreasing by one each time around',
        '<code>1024</code>, which is the value the loop variable holds on its very last iteration'
      ],
      a: 0,
      why: 'The loop variable takes the values 2048, 1024, … , 2 — eleven iterations — and then 1 fails the <code>i &gt; 1</code> test, so the body never runs for it. This is the loop from the lesson rewritten as a <code>while</code>; the count is the same either way.'
    },
    {
      q: 'Why does this fail to compile?',
      lang: 'java',
      code: 'String s = "This won\'t work";\nfor (char c : s) {\n    System.out.println(c);\n}',
      opts: [
        'A for-each only works on an array or something that implements <code>Iterable</code>',
        'The loop variable of a for-each has to be declared outside the loop first',
        'A <code>String</code> is immutable, and a for-each always needs to modify what it walks',
        'The element type is wrong — it would compile if <code>char</code> were written as <code>String</code>'
      ],
      a: 0,
      why: 'ECJ says it exactly: <em>Can only iterate over an array or an instance of java.lang.Iterable</em>. <code>String</code> is neither. Changing <code>char</code> to <code>String</code> does not help, because the problem is what you are iterating over, not the type you are pulling out.'
    },
    {
      q: 'A <code>do-while</code> loop whose condition is <code>false</code> from the very start runs its body how many times?',
      opts: [
        'Once',
        'Never, exactly like the equivalent <code>while</code> loop would behave',
        'Twice — once before the check, and once more after the check fails',
        'It depends on whether the condition mentions the loop variable at all'
      ],
      a: 0,
      why: 'A <code>do-while</code> runs the body first and tests afterwards, so the body always runs at least once. That is precisely what makes it fit input validation: you need the input before you can judge it. Do not forget the semicolon after <code>while (…)</code>.'
    },
    {
      q: 'What does this print?',
      lang: 'java',
      code: 'for (int i = 0; i < 3; ++i) {\n    System.out.println(i + " : outer");\n    for (int j = 0; j < 3; ++j) {\n        System.out.println(i + "," + j + " : inner");\n        break;\n    }\n}\nSystem.out.println("done");',
      opts: [
        'Three outer lines, each followed by one inner line, then <code>done</code>',
        'One outer line and one inner line, then <code>done</code> — the break ends both loops',
        'Three outer lines and nine inner lines, then <code>done</code>, because break only skips one pass',
        'Three outer lines and no inner lines at all, then <code>done</code>, since the break comes first'
      ],
      a: 0,
      why: 'An unlabelled <code>break</code> ends only the loop it is in — here the inner one — so the outer loop carries on and starts a fresh inner loop each time. To leave both at once you need a labelled <code>break done;</code>.'
    },
    {
      q: 'What is the restriction on <code>break &lt;label&gt;;</code> that stops it becoming a <code>goto</code>?',
      opts: [
        'It can only jump to the end of a block that encloses it',
        'It can only be used inside a loop, never inside a plain labelled block or a switch',
        'It can only jump backwards, to a label that appears earlier in the same method',
        'It can only appear once per method, so a method can never have two labelled breaks'
      ],
      a: 0,
      why: 'You can only break out to an <em>enclosing</em> block, so control always moves forward and outward — never into an unrelated block elsewhere in the method. That is what keeps it from being the spaghetti-code machine an unrestricted <code>goto</code> is.'
    },
    {
      q: 'What does <code>continue</code> do inside a loop?',
      opts: [
        'Skips the rest of this iteration and goes back to the start of the loop',
        'Stops the loop immediately and resumes at the first statement after it',
        'Restarts the loop from its very first iteration, resetting the loop variable',
        'Re-runs the body of the loop a second time before moving to the next iteration'
      ],
      a: 0,
      why: 'It is the inverse of <code>break</code>: <code>break</code> leaves the loop, <code>continue</code> abandons just this pass. It reads best as a filter — "this item is no good, next one please" — which is how the prime-finding example drops the <code>isPrime</code> flag entirely.'
    },
    {
      q: 'When is this problem detected?',
      lang: 'java',
      code: 'int[] a = new int[5];\nSystem.out.println("before");\nSystem.out.println(a[23]);',
      opts: [
        'At run time — it prints <code>before</code>, then throws',
        'At compile time, because the compiler can see that 23 is outside the declared size',
        'Neither — it prints <code>before</code> and then a <code>0</code>, the default value for an int',
        'At run time, but only if the array was created with a size known at compile time'
      ],
      a: 0,
      why: 'The compiler does not track index values in general, so this is an <code>ArrayIndexOutOfBoundsException</code> at run time — note that <code>before</code> is printed first, which tells you the program really did start. Compare it with using an array you never initialised, which the compiler <em>does</em> catch.'
    },
    {
      q: 'What does this print?',
      lang: 'java',
      code: 'int[] a = new int[2];\na[0] = 1;\na[1] = 4;\nint[] b = a;\na = new int[4];\nSystem.out.println("a[1] == " + a[1] + ", b[1] == " + b[1]);',
      opts: [
        '<code>a[1] == 0, b[1] == 4</code>',
        '<code>a[1] == 4, b[1] == 4</code>, because <code>b</code> and <code>a</code> stay the same array',
        '<code>a[1] == 0, b[1] == 0</code>, because the new array replaced the old one everywhere',
        '<code>a[1] == 4, b[1] == 0</code>, because <code>b</code> was only a copy of the first cell'
      ],
      a: 0,
      why: 'Arrays are objects, and the variable holds a reference to one. Assigning a new array to <code>a</code> repoints <code>a</code> only — it does not overwrite the old array, which <code>b</code> still refers to, so <code>b[1]</code> is still 4. And the fresh array is auto-initialised, so <code>a[1]</code> is 0.'
    },
    {
      q: 'What does this print?',
      lang: 'java',
      code: 'String[] a = new String[3];\nint[] n = new int[3];\nSystem.out.println(a[1]);\nSystem.out.println(n[1]);',
      opts: [
        '<code>null</code> then <code>0</code>',
        'An empty line then <code>0</code>, because a new String defaults to <code>""</code>',
        'It does not compile, because neither array has been given any values yet',
        'It throws at run time, because reading an uninitialised cell is not allowed in Java'
      ],
      a: 0,
      why: 'Java fills every cell of a new array with the default for its type: <code>0</code> for numbers, <code>false</code> for booleans, and <code>null</code> for any object type. So the cells genuinely are readable — <code>null</code> is a real value, not an error, and <code>println</code> prints it as the word <code>null</code>.'
    },
    {
      q: 'What is <code>int[][]</code> in Java, really?',
      opts: [
        'An array whose elements are themselves arrays of <code>int</code>',
        'A special two-dimensional object, which is why the rows must all be the same length',
        'A single flat block of memory, with the two indices combined into one offset',
        'A pair of parallel arrays, one holding the rows and one holding the column counts'
      ],
      a: 0,
      why: 'Appending <code>[]</code> to a type means "array of that type", so <code>int[][]</code> is an array of <code>int[]</code>. That is exactly why rows can differ in length — <code>new int[3][]</code> then gives each row its own size — and why <code>values[i]</code> hands you back a whole <code>int[]</code>.'
    },
    {
      q: 'Which statement about Python lists is true?',
      opts: [
        'Their length is found with <code>len(l)</code> and they can hold mixed types',
        'They are fixed in size once created, exactly like a Java array is',
        'They expose a <code>.length</code> attribute, in the same way a Java array does',
        'Every element must share one type, which is chosen by whatever you put in first'
      ],
      a: 0,
      why: 'Vanilla Python has no array type — lists do that job. They grow with <code>append</code>, hold whatever mixture of types you like, and report their size through the generic <code>len</code> function rather than a field or a method of their own.'
    },
    {
      q: 'What does this print?',
      lang: 'python',
      code: "l = [1, 2, 3]\nl[1:1] = ['a', 'b', 'c']\nprint(l)",
      opts: [
        "<code>[1, 'a', 'b', 'c', 2, 3]</code>",
        "<code>[1, ['a', 'b', 'c'], 2, 3]</code> — the whole list goes in as one element",
        "<code>['a', 'b', 'c', 2, 3]</code>, because the slice replaces the element at index 1",
        "<code>[1, 'a', 2, 3]</code>, because only as many items as the slice is wide are used"
      ],
      a: 0,
      why: 'A slice of width zero — from just before index 1 to just before index 1 — selects nothing, so nothing is removed and the whole right-hand list is squeezed in at that point. Give it a wider slice, like <code>l[1:3] = ["wooooo"]</code>, and it replaces those elements instead.'
    },
    {
      q: 'What does this print?',
      lang: 'python',
      code: 'print(type(set()))\nprint(type({}))',
      opts: [
        "<code>&lt;class 'set'&gt;</code> then <code>&lt;class 'dict'&gt;</code>",
        "<code>&lt;class 'set'&gt;</code> then <code>&lt;class 'set'&gt;</code> — empty braces make an empty set",
        "<code>&lt;class 'dict'&gt;</code> then <code>&lt;class 'dict'&gt;</code>, since a set is a dict with no values",
        "It raises a <code>TypeError</code>, because <code>set()</code> needs something to put in the set"
      ],
      a: 0,
      why: 'Sets and dicts share the <code>{ }</code> syntax, and the empty case had to go to one of them — it went to <code>dict</code>. So an empty set has to be written <code>set()</code>. <code>set()</code> with no argument is perfectly legal and gives you an empty set.'
    },
    {
      q: 'What does this print?',
      lang: 'python',
      code: 'print(type((1)))\nprint(type((1,)))',
      opts: [
        "<code>&lt;class 'int'&gt;</code> then <code>&lt;class 'tuple'&gt;</code>",
        "<code>&lt;class 'tuple'&gt;</code> then <code>&lt;class 'tuple'&gt;</code> — both are one-element tuples",
        "<code>&lt;class 'int'&gt;</code> then <code>&lt;class 'int'&gt;</code>, because the comma is just ignored",
        "<code>&lt;class 'tuple'&gt;</code> then a <code>SyntaxError</code> from the trailing comma"
      ],
      a: 0,
      why: 'It is the comma, not the parentheses, that makes a tuple — <code>(1)</code> is just the number 1 in brackets. So a one-element tuple needs that slightly odd-looking trailing comma: <code>(1,)</code>.'
    },
    {
      q: 'What does this print?',
      lang: 'python',
      code: 'while True:\n    print("once")\n    break\nelse:\n    print("finished")\nprint("after")',
      opts: [
        '<code>once</code> then <code>after</code>',
        '<code>once</code>, then <code>finished</code>, then <code>after</code> — the else always runs',
        '<code>once</code> then <code>finished</code>, and <code>after</code> is never reached',
        'Nothing at all, because <code>while True</code> with an <code>else</code> is a syntax error'
      ],
      a: 0,
      why: 'Python&rsquo;s loop-<code>else</code> runs when the loop ends because its <em>condition</em> failed — and a <code>break</code> skips it. Here the loop is left by <code>break</code>, so <code>finished</code> never prints, but execution carries straight on to the line after the loop.'
    },
    {
      q: 'In Python you can write <code>people.append((name, num))</code> to keep a String and an int together. Why can Java not simply do the same with an array?',
      opts: [
        'An array has a single element type, and Java has no tuple',
        'Java arrays cannot be appended to, so the pairs would have nowhere to go',
        'Java would allow it, but only after the array has been declared as <code>Object[]</code>',
        'Java has tuples, but they live in a library that has to be imported before use'
      ],
      a: 0,
      why: 'Both halves matter: every cell of a Java array has the one declared type, and there is no tuple type to hold the pair in the first place. The lesson&rsquo;s stop-gap is two parallel arrays kept in step by index; the tidier answer is a small class used to carry the data.'
    },
    {
      q: 'In the <code>Favourites</code> example, why does the little data-carrying class have to be declared <code>static</code>?',
      opts: [
        'Because <code>main</code> is itself static, and so cannot use a non-static inner class',
        'Because a class with only public fields and no methods must always be static',
        'Because arrays can only hold static types, which is what <code>Data[]</code> requires',
        'Because a class declared inside another class is not visible until it is made static'
      ],
      a: 0,
      why: 'A non-static inner class needs an instance of the enclosing class to exist, and <code>main</code> is static — there is no such instance. Marking it <code>static</code> cuts that tie. Making the fields <code>public</code> is the deliberately ugly shortcut here, and the classes module replaces it properly.'
    }
  ]
};
