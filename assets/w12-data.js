/* Newly authored practice, adapted from Ed and Canvas topics. */
window.WEEK_DATA = {
  "id": "week-12",
  "quiz": [
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "public class Demo {\n    public static void main(String[] args) {\n        int[] marks={49,50,85};\n        int passed=0;\n        for(int i=0;i<marks.length;i++) {\n            if(marks[i]>=50) passed++;\n        }\n        System.out.println(passed);\n    }\n}\n",
      "lang": "java",
      "opts": [
        "<code>2</code>",
        "<code>1</code>",
        "<code>3</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 0,
      "why": "Exactly 50 is included, so the marks 50 and 85 pass."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "def change(values):\n    values.append(3)\n    values=[9]\n    return values\n\nitems=[1,2]\nresult=change(items)\nprint(items)\nprint(result)\n",
      "lang": "python",
      "opts": [
        "<code>[9]<br>[9]</code>",
        "<code>[1, 2, 3]<br>[9]</code>",
        "<code>[1, 2]<br>[9]</code>",
        "<code>[1, 2, 3]<br>[1, 2, 3]</code>"
      ],
      "a": 1,
      "why": "Appending affects the shared list; assigning a new list to the local name does not rebind items."
    },
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "import java.io.*;\n\npublic class Demo {\n    public static void main(String[] args) {\n        String data=\"Linh,85\\nAn,49\\nMai,50\";\n        int count=0,passed=0;\n        try(BufferedReader reader=new BufferedReader(new StringReader(data))) {\n            String line;\n            while((line=reader.readLine())!=null) {\n                String[] parts=line.split(\",\");\n                int mark=Integer.parseInt(parts[1]);\n                count++;\n                if(mark>=50) passed++;\n            }\n        } catch(IOException e) { throw new RuntimeException(e); }\n        System.out.println(\"records=\"+count+\", passed=\"+passed);\n    }\n}\n",
      "lang": "java",
      "opts": [
        "<code>records=3, passed=1</code>",
        "<code>records=2, passed=2</code>",
        "<code>records=3, passed=2</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 2,
      "why": "All three valid simple records are read, including the final line without a newline; two marks pass."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "def parse(line):\n    name,text=line.split(\",\")\n    mark=int(text)\n    if not 0<=mark<=100:\n        raise ValueError(\"range\")\n    return name,mark\n\nrecords=[]\nfor line in [\"Linh,85\",\"An,bad\",\"Mai,50\"]:\n    try: records.append(parse(line))\n    except ValueError: print(\"Invalid\")\nprint(sum(mark>=50 for name,mark in records))\n",
      "lang": "python",
      "opts": [
        "<code>Invalid<br>1</code>",
        "<code>2</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced.",
        "<code>Invalid<br>2</code>"
      ],
      "a": 3,
      "why": "The bad record is not appended; Linh and Mai both pass."
    },
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "public class Demo {\n    public static void main(String[] args) {\n        Counter counter=new Counter(2);\n        System.out.println(counter.take(0));\n        System.out.println(counter.take(2));\n        System.out.println(counter.take(1));\n        System.out.println(counter.left());\n    }\n}\nclass Counter {\n    private int count;\n    Counter(int count) { this.count=count; }\n    boolean take(int n) {\n        if(n<=0 || n>count) return false;\n        count-=n;\n        return true;\n    }\n    int left() { return count; }\n}\n",
      "lang": "java",
      "opts": [
        "<code>false<br>true<br>false<br>0</code>",
        "<code>true<br>true<br>false<br>0</code>",
        "<code>false<br>false<br>true<br>1</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 0,
      "why": "Zero is rejected; taking exactly 2 succeeds; taking 1 from zero stock is rejected."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "marks=[49,50,85]\ntotal=0\nfor position,mark in enumerate(marks):\n    before=total\n    total+=mark\n    print(position,before,total)\nprint(\"total\",total)\n",
      "lang": "python",
      "opts": [
        "<code>0 0 49<br>1 49 99<br>2 99 184<br>total 185</code>",
        "<code>0 0 49<br>1 49 99<br>2 99 184<br>total 184</code>",
        "<code>0 49 49<br>1 50 99<br>2 85 184<br>total 184</code>",
        "<code>0 0 49<br>1 49 50<br>2 50 85<br>total 85</code>"
      ],
      "a": 1,
      "why": "The accumulator moves 0 \u2192 49 \u2192 99 \u2192 184; the trace connects each new state to its cause."
    },
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "import java.util.*;\n\npublic class Demo {\n    public static void main(String[] args) {\n        List<Integer> marks=Arrays.asList(49,50,85);\n        int total=marks.stream()\n            .filter(mark -> mark>=50)\n            .mapToInt(mark -> mark)\n            .sum();\n        System.out.println(total);\n        System.out.println(marks);\n    }\n}\n",
      "lang": "java",
      "opts": [
        "<code>184<br>[49, 50, 85]</code>",
        "<code>135<br>[50, 85]</code>",
        "<code>135<br>[49, 50, 85]</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 2,
      "why": "The pipeline sums 50 and 85 without changing the source list. This uses Java 8-compatible APIs."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "def doubled(values):\n    return [value*2 for value in values]\n\nsource=[2,3]\nprint(doubled(source))\nprint(source)\nprint(doubled(source)==doubled(source))\n",
      "lang": "python",
      "opts": [
        "<code>[4, 6]<br>[4, 6]<br>True</code>",
        "<code>[2, 3]<br>[2, 3]<br>True</code>",
        "<code>[4, 6]<br>[2, 3]<br>False</code>",
        "<code>[4, 6]<br>[2, 3]<br>True</code>"
      ],
      "a": 3,
      "why": "For the same integer input this function returns the same result and does not modify its argument."
    },
    {
      "q": "Which test directly distinguishes >=50 from >50?",
      "opts": [
        "A mark equal to 50.",
        "A mark equal to 85, since both comparisons disagree for every passing mark.",
        "An empty list, since its missing mark is automatically treated as exactly fifty.",
        "A mark equal to zero, since both comparisons disagree for every failing mark."
      ],
      "a": 0,
      "why": "Only the equality boundary distinguishes these two comparisons."
    },
    {
      "q": "What count should a summary of valid records use?",
      "opts": [
        "The number originally declared by the input, even when some of those records were rejected.",
        "The number of records that passed parsing and validation.",
        "The number of diagnostic messages, because each diagnostic represents one valid record.",
        "The number of fields on the last line, because it determines the size of the whole dataset."
      ],
      "a": 1,
      "why": "Attempted input count and successful record count can differ."
    },
    {
      "q": "What makes a code explanation useful?",
      "opts": [
        "It repeats every punctuation mark aloud while avoiding the values used by the program.",
        "It states that the code works because the output looked plausible on one ordinary input.",
        "It connects a concrete state or rule to the observed result.",
        "It describes only formatting choices and never mentions control flow or changing state."
      ],
      "a": 2,
      "why": "A causal explanation shows why a result follows and helps predict changed inputs."
    },
    {
      "q": "What do the optional stream examples change about the computation?",
      "opts": [
        "They remove the need for any decisions or repeated processing of data elements.",
        "They guarantee that invalid input can never produce an exception in any program.",
        "They make the original source list shrink whenever an element fails the filter.",
        "They express selection and aggregation with a pipeline."
      ],
      "a": 3,
      "why": "Streams express familiar traversal operations. The example does not mutate its source list."
    }
  ]
};
