/* Newly authored practice, adapted from Ed and Canvas topics. */
window.WEEK_DATA = {
  "id": "week-7",
  "quiz": [
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "import java.util.ArrayList;\n\npublic class Demo {\n    public static void main(String[] args) {\n        ArrayList<String> names = new ArrayList<String>();\n        names.add(\"An\");\n        names.add(\"Mai\");\n        names.add(1,\"Linh\");\n        names.set(0,\"Binh\");\n        System.out.println(names);\n        System.out.println(names.size());\n    }\n}\n",
      "lang": "java",
      "opts": [
        "<code>[Binh, Linh]<br>2</code>",
        "<code>[An, Linh, Mai]<br>3</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced.",
        "<code>[Binh, Linh, Mai]<br>3</code>"
      ],
      "a": 3,
      "why": "add at an index inserts; set replaces. Three elements remain."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "names = [\"An\", \"Mai\"]\nnames.insert(1, \"Linh\")\nnames[0] = \"Binh\"\nprint(names)\nprint(len(names))\n",
      "lang": "python",
      "opts": [
        "<code>[&#x27;Binh&#x27;, &#x27;Linh&#x27;, &#x27;Mai&#x27;]<br>3</code>",
        "<code>[&#x27;Binh&#x27;, &#x27;Mai&#x27;, &#x27;Linh&#x27;]<br>3</code>",
        "<code>[&#x27;An&#x27;, &#x27;Linh&#x27;, &#x27;Mai&#x27;]<br>3</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 0,
      "why": "Python lists offer the same insert/replace distinction, with different syntax."
    },
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "import java.util.ArrayList;\nimport java.util.Arrays;\n\npublic class Demo {\n    public static void main(String[] args) {\n        ArrayList<Integer> values = new ArrayList<Integer>(Arrays.asList(4,1,4));\n        values.remove(1);\n        values.remove(Integer.valueOf(4));\n        System.out.println(values);\n    }\n}\n",
      "lang": "java",
      "opts": [
        "<code>[1]</code>",
        "<code>[4]</code>",
        "<code>[]</code>",
        "<code>[4, 4]</code>"
      ],
      "a": 1,
      "why": "The index removal leaves [4,4]; the value removal deletes only the first 4."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "values = [1, 2, 2, 3, 4]\nkept = [value for value in values if value % 2 == 1]\nprint(kept)\nprint(values)\n",
      "lang": "python",
      "opts": [
        "<code>[1, 3]<br>[1, 3]</code>",
        "<code>[2, 2, 4]<br>[1, 2, 2, 3, 4]</code>",
        "<code>[1, 3]<br>[1, 2, 2, 3, 4]</code>",
        "<code>[1, 2, 3]<br>[1, 2, 2, 3, 4]</code>"
      ],
      "a": 2,
      "why": "Filtering leaves the source unchanged and keeps both order and only the matching values."
    },
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "import java.util.LinkedList;\n\npublic class Demo {\n    public static void main(String[] args) {\n        LinkedList<String> queue = new LinkedList<String>();\n        queue.addLast(\"An\");\n        queue.addLast(\"Mai\");\n        System.out.println(queue.removeFirst());\n        System.out.println(queue);\n    }\n}\n",
      "lang": "java",
      "opts": [
        "<code>Mai<br>[An]</code>",
        "<code>An<br>[An, Mai]</code>",
        "<code>An<br>[]</code>",
        "<code>An<br>[Mai]</code>"
      ],
      "a": 3,
      "why": "The first name to arrive is the first to leave."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "from collections import deque\nqueue = deque([\"An\", \"Mai\"])\nprint(queue.popleft())\nprint(list(queue))\n",
      "lang": "python",
      "opts": [
        "<code>An<br>[&#x27;Mai&#x27;]</code>",
        "<code>Mai<br>[&#x27;An&#x27;]</code>",
        "<code>An<br>[&#x27;An&#x27;, &#x27;Mai&#x27;]</code>",
        "<code>An<br>[]</code>"
      ],
      "a": 0,
      "why": "popleft removes An, and Mai remains waiting."
    },
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "public class Demo {\n    public static void main(String[] args) {\n        Box<String> label = new Box<String>(\"tea\");\n        Box<Integer> count = new Box<Integer>(3);\n        System.out.println(label.get() + \" \" + count.get());\n    }\n}\nclass Box<T> {\n    private final T value;\n    Box(T value) { this.value = value; }\n    T get() { return value; }\n}\n",
      "lang": "java",
      "opts": [
        "<code>tea null</code>",
        "<code>tea 3</code>",
        "<code>null 3</code>",
        "<code>3 tea</code>"
      ],
      "a": 1,
      "why": "The class is reused with two types while each individual box retains a checked element type."
    },
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "import java.util.*;\n\npublic class Demo {\n    static int total(List<Integer> xs) {\n        int sum=0;\n        for(int x:xs) sum+=x;\n        return sum;\n    }\n    public static void main(String[] args) {\n        List<Integer> a = new ArrayList<Integer>(Arrays.asList(2,3));\n        List<Integer> b = new LinkedList<Integer>(a);\n        System.out.println(total(a));\n        System.out.println(total(b));\n    }\n}\n// Both lists satisfy the same operations used here.\n",
      "lang": "java",
      "opts": [
        "<code>2<br>3</code>",
        "<code>5<br>0</code>",
        "<code>5<br>5</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 2,
      "why": "The total uses only iteration; the storage implementation does not change the result."
    },
    {
      "q": "Which declaration uses an allowed element type?",
      "opts": [
        "ArrayList&lt;int&gt; values = new ArrayList&lt;int&gt;(); // use primitive int directly",
        "ArrayList&lt;double&gt; values = new ArrayList&lt;double&gt;(); // primitive doubles",
        "ArrayList&lt;boolean&gt; values = new ArrayList&lt;boolean&gt;(); // primitive booleans",
        "ArrayList&lt;Integer&gt; values = new ArrayList&lt;Integer&gt;();"
      ],
      "a": 3,
      "why": "Generic arguments are reference types; wrapper classes represent primitives."
    },
    {
      "q": "Why can remove(index) on LinkedList take linear time?",
      "opts": [
        "Finding the node at that index may require traversal.",
        "Every linked-list removal must shift all later values into adjacent array slots.",
        "Java always copies the whole list into an ArrayList before removing a single node.",
        "Every linked-list node is sorted numerically whenever an index is supplied."
      ],
      "a": 0,
      "why": "Relinking is cheap once positioned, but an index is not a direct node reference."
    },
    {
      "q": "A list has size 3. Which index is valid for add(index,value) but not get(index)?",
      "opts": [
        "2, because a list of size 3 has no element at any even numbered index.",
        "3",
        "1, because insertion positions and element indices always have opposite parity.",
        "0, because inserting before the first item makes index zero inaccessible."
      ],
      "a": 1,
      "why": "Insertion at size appends; element access requires an existing element."
    },
    {
      "q": "Why should total accept List<Integer> instead of ArrayList<Integer>?",
      "opts": [
        "It makes every implementation automatically use exactly the same amount of memory.",
        "It forces LinkedList to store its elements in a contiguous backing array.",
        "It needs iteration, not one particular storage implementation.",
        "It disables compile-time type checking so mixed element types can be accepted freely."
      ],
      "a": 2,
      "why": "Using the required abstraction admits multiple implementations without requiring irrelevant details."
    }
  ]
};
