/* Newly authored practice, adapted from Ed and Canvas topics. */
window.WEEK_DATA = {
  "id": "week-10",
  "quiz": [
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "import java.io.*;\n\npublic class Demo {\n    public static void main(String[] args) {\n        StringWriter buffer=new StringWriter();\n        try(PrintWriter writer=new PrintWriter(buffer)) {\n            writer.println(\"name,mark\");\n            writer.println(\"Linh,85\");\n        }\n        System.out.print(buffer.toString());\n    }\n}\n",
      "lang": "java",
      "opts": [
        "<code>Linh,85<br>name,mark</code>",
        "<code>name,markLinh,85</code>",
        "<code>name,mark<br>Linh,85</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 2,
      "why": "The writer emits the header then the record. The buffer lets the page show exactly what would be written."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "from io import StringIO\nbuffer=StringIO()\nbuffer.write(\"tea\")\nbuffer.write(\"coffee\")\nprint(repr(buffer.getvalue()))\nbuffer.close()\n",
      "lang": "python",
      "opts": [
        "<code>&#x27;tea\\ncoffee&#x27;</code>",
        "<code>&#x27;tea coffee&#x27;</code>",
        "<code>&#x27;coffee&#x27;</code>",
        "<code>&#x27;teacoffee&#x27;</code>"
      ],
      "a": 3,
      "why": "The two writes concatenate; print adds a newline only when displaying the representation."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "from pathlib import Path\nfrom tempfile import TemporaryDirectory\n\nwith TemporaryDirectory() as folder:\n    path=Path(folder)/\"report.txt\"\n    with path.open(\"w\",encoding=\"utf-8\") as out:\n        out.write(\"old\\n\")\n    with path.open(\"w\",encoding=\"utf-8\") as out:\n        out.write(\"new\\n\")\n    with path.open(\"a\",encoding=\"utf-8\") as out:\n        out.write(\"tail\\n\")\n    print(path.read_text(encoding=\"utf-8\"),end=\"\")\n",
      "lang": "python",
      "opts": [
        "<code>new<br>tail</code>",
        "<code>old<br>new<br>tail</code>",
        "<code>old<br>tail</code>",
        "<code>tail<br>new</code>"
      ],
      "a": 0,
      "why": "The second write-mode open replaces old with new; append then adds tail."
    },
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "import java.io.*;\n\npublic class Demo {\n    public static void main(String[] args) throws IOException {\n        File file=new File(\"report.txt\");\n        try(PrintWriter out=new PrintWriter(file,\"UTF-8\")) {\n            out.println(\"name,mark\");\n            out.println(\"Linh,85\");\n            if(out.checkError()) throw new IOException(\"write failed\");\n        }\n        try(BufferedReader in=new BufferedReader(new InputStreamReader(new FileInputStream(file),\"UTF-8\"))) {\n            String line;\n            while((line=in.readLine())!=null) System.out.println(line);\n        }\n    }\n}\n",
      "lang": "java",
      "opts": [
        "<code>Linh,85</code>",
        "<code>name,mark<br>Linh,85</code>",
        "<code>name,markLinh,85</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 1,
      "why": "Closing completes the output before a new reader opens the same file. The output order is the order written."
    },
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "public class Demo {\n    static String format(String name,int mark) { return name+\",\"+mark; }\n    public static void main(String[] args) {\n        String[] names={\"Linh\",\"An\"};\n        int[] marks={85,49};\n        for(int i=0;i<names.length;i++) System.out.println(format(names[i],marks[i]));\n    }\n}\n",
      "lang": "java",
      "opts": [
        "<code>Linh 85<br>An 49</code>",
        "<code>An,49<br>Linh,85</code>",
        "<code>Linh,85<br>An,49</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 2,
      "why": "The formatter pairs each name with the corresponding mark; persistence is a separate choice."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "import csv\nfrom io import StringIO\nbuffer=StringIO(newline=\"\")\nwriter=csv.writer(buffer,lineterminator=\"\\n\")\nwriter.writerow([\"name\",\"mark\"])\nwriter.writerow([\"An, Mai\",85])\nprint(buffer.getvalue(),end=\"\")\nbuffer.seek(0)\nrows=list(csv.reader(buffer))\nprint(rows[1][0])\nbuffer.close()\n",
      "lang": "python",
      "opts": [
        "<code>name,mark<br>An, Mai,85<br>An</code>",
        "<code>name,mark<br>&quot;An, Mai&quot;,85<br>&quot;An, Mai&quot;</code>",
        "<code>name,mark<br>An,85<br>An</code>",
        "<code>name,mark<br>&quot;An, Mai&quot;,85<br>An, Mai</code>"
      ],
      "a": 3,
      "why": "CSV quotes the name containing a comma; the reader returns the original field without the quoting characters."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "import json\nrecord={\"name\":\"Linh\",\"marks\":[85,90]}\ntext=json.dumps(record,sort_keys=True)\nrestored=json.loads(text)\nprint(restored[\"name\"])\nprint(sum(restored[\"marks\"]))\nprint(restored==record)\n",
      "lang": "python",
      "opts": [
        "<code>Linh<br>175<br>True</code>",
        "<code>Linh<br>85<br>True</code>",
        "<code>Linh<br>175<br>False</code>",
        "<code>175<br>Linh<br>True</code>"
      ],
      "a": 0,
      "why": "The round trip preserves the two marks and name; their sum is 175."
    },
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "import java.io.*;\n\npublic class Demo {\n    public static void main(String[] args) {\n        int[] marks={85,49,50};\n        int passed=0,total=0;\n        for(int mark:marks) { total+=mark; if(mark>=50) passed++; }\n        StringWriter buffer=new StringWriter();\n        try(PrintWriter out=new PrintWriter(buffer)) {\n            out.println(\"count,total,passed\");\n            out.println(marks.length+\",\"+total+\",\"+passed);\n        }\n        System.out.print(buffer.toString());\n    }\n}\n",
      "lang": "java",
      "opts": [
        "<code>count,total,passed<br>3,184,1</code>",
        "<code>count,total,passed<br>3,184,2</code>",
        "<code>count,total,passed<br>3,185,2</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 1,
      "why": "The total is 184 and two marks pass. Keeping the header and record order consistent is part of the format contract."
    },
    {
      "q": "Which Python mode preserves existing text and writes at the end?",
      "opts": [
        "w, because write mode always preserves every byte from the previous contents.",
        "r, because read mode allows arbitrary output at the current end of the file.",
        "a",
        "x, because exclusive creation opens an already existing file without changing it."
      ],
      "a": 2,
      "why": "Append mode preserves previous content; w truncates, r reads, x requires a new file."
    },
    {
      "q": "What does f.write(\"tea\") add automatically?",
      "opts": [
        "Exactly one newline and one space after the supplied characters on every call.",
        "A comma before the characters whenever the previous call wrote a non-empty string.",
        "A complete CSV header followed by a newline, inferred from the string argument.",
        "No extra separator or newline."
      ],
      "a": 3,
      "why": "write emits the supplied string. Add a newline yourself or use an appropriately configured print or writer."
    },
    {
      "q": "Why use an in-memory writer in a report test?",
      "opts": [
        "To inspect the exact formatted text independently of file storage.",
        "To prove that the eventual disk is writable and its file permissions are correct.",
        "To prevent the report formatter from ever producing an invalid record or delimiter.",
        "To make every reader interpret a comma inside a name as ordinary unquoted text."
      ],
      "a": 0,
      "why": "A memory writer isolates formatting; a separate integration check covers the file destination."
    },
    {
      "q": "A JSON document parses successfully. What remains to check?",
      "opts": [
        "Nothing at all, because parsing proves every required field and allowed mark is present.",
        "Whether its structure and values meet the application rules.",
        "Only its indentation, because JSON parsers guarantee that field meanings are correct.",
        "Only its filename extension, because the document contents cannot affect a program."
      ],
      "a": 1,
      "why": "Syntax validity and domain validity are separate checks."
    }
  ]
};
