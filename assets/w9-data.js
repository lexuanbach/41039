/* Newly authored practice, adapted from Ed and Canvas topics. */
window.WEEK_DATA = {
  "id": "week-9",
  "quiz": [
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "public class Demo {\n    public static void main(String[] args) {\n        String[] values={\"12\",\"bad\",\"7\"};\n        for(String text:values) {\n            try { System.out.println(Integer.parseInt(text)+1); }\n            catch(NumberFormatException e) { System.out.println(\"Invalid: \"+text); }\n        }\n    }\n}\n",
      "lang": "java",
      "opts": [
        "<code>13<br>8</code>",
        "<code>13<br>Invalid: bad<br>8</code>",
        "<code>12<br>Invalid: bad<br>7</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 1,
      "why": "The failed conversion jumps to the matching catch; the next loop iteration still runs."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "for text in [\"12\", \"bad\", \"7\"]:\n    try:\n        value = int(text)\n    except ValueError:\n        print(\"Invalid:\", text)\n    else:\n        print(value + 1)\n",
      "lang": "python",
      "opts": [
        "<code>13<br>8</code>",
        "<code>12<br>Invalid: bad<br>7</code>",
        "<code>13<br>Invalid: bad<br>8</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 2,
      "why": "The else suite runs only for successfully parsed values; a ValueError produces the diagnostic."
    },
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "public class Demo {\n    static void parse() { Integer.parseInt(\"x\"); }\n    public static void main(String[] args) {\n        try {\n            parse();\n            System.out.println(\"after parse\");\n        } catch(NumberFormatException e) {\n            System.out.println(\"caught\");\n        } finally {\n            System.out.println(\"cleanup\");\n        }\n        System.out.println(\"done\");\n    }\n}\n",
      "lang": "java",
      "opts": [
        "<code>after parse<br>caught<br>cleanup<br>done</code>",
        "<code>caught<br>done<br>cleanup</code>",
        "<code>cleanup<br>caught<br>done</code>",
        "<code>caught<br>cleanup<br>done</code>"
      ],
      "a": 3,
      "why": "The line after parse is skipped. The matching catch runs, then finally, then the following statement."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "def mark(text):\n    value = int(text)\n    if not 0 <= value <= 100:\n        raise ValueError(\"mark out of range\")\n    return value\n\ntry:\n    print(mark(\"120\"))\nexcept ValueError as error:\n    print(error)\nfinally:\n    print(\"checked\")\n",
      "lang": "python",
      "opts": [
        "<code>mark out of range<br>checked</code>",
        "<code>120<br>checked</code>",
        "<code>checked<br>mark out of range</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 0,
      "why": "The conversion succeeds, but the range check raises before returning a mark."
    },
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "import java.util.Scanner;\n\npublic class Demo {\n    public static void main(String[] args) {\n        try(Scanner reader=new Scanner(\"10 20\\n30\")) {\n            int total=0;\n            while(reader.hasNextInt()) total+=reader.nextInt();\n            System.out.println(total);\n        }\n    }\n}\n",
      "lang": "java",
      "opts": [
        "<code>30</code>",
        "<code>60</code>",
        "<code>10<br>20<br>30</code>",
        "<code>0</code>"
      ],
      "a": 1,
      "why": "Scanner treats spaces and newlines as token separators here; it sums all three integers."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "from io import StringIO\n\nwith StringIO(\"tea\\n\\ncoffee\\n\") as source:\n    for line_number, line in enumerate(source, 1):\n        print(f\"{line_number}: {line.rstrip(chr(10))}\")\n",
      "lang": "python",
      "opts": [
        "<code>1: tea<br>2: coffee</code>",
        "<code>1: tea<br>3: coffee</code>",
        "<code>1: tea<br>2: <br>3: coffee</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced."
      ],
      "a": 2,
      "why": "A blank line still exists; stripping its newline does not remove the line from iteration."
    },
    {
      "q": "What is the complete outcome of this Java program?",
      "code": "import java.io.*;\n\npublic class Demo {\n    public static void main(String[] args) {\n        try(BufferedReader reader=new BufferedReader(new StringReader(\"tea\\n\\ncoffee\"))) {\n            String line;\n            int count=0;\n            while((line=reader.readLine())!=null) {\n                count++;\n                System.out.println(count+\": \"+line);\n            }\n        } catch(IOException e) { System.out.println(\"Read failed\"); }\n    }\n}\n",
      "lang": "java",
      "opts": [
        "<code>1: tea<br>2: coffee</code>",
        "<code>1: tea<br>3: coffee</code>",
        "Execution stops with a runtime error before completing the program; the remaining output is not produced.",
        "<code>1: tea<br>2: <br>3: coffee</code>"
      ],
      "a": 3,
      "why": "The reader returns an empty string for the middle line, and null only after coffee."
    },
    {
      "q": "What is the complete outcome of this Python program?",
      "code": "from pathlib import Path\nfrom tempfile import TemporaryDirectory\n\nwith TemporaryDirectory() as folder:\n    path = Path(folder) / \"marks.txt\"\n    path.write_text(\"Linh,85\\nAn,49\\n\", encoding=\"utf-8\")\n    with path.open(\"r\", encoding=\"utf-8\") as source:\n        for line in source:\n            name, mark = line.rstrip(\"\\n\").split(\",\")\n            print(name, int(mark) >= 50)\n",
      "lang": "python",
      "opts": [
        "<code>Linh True<br>An False</code>",
        "<code>Linh True<br>An True</code>",
        "<code>Linh False<br>An False</code>",
        "<code>Linh 85<br>An 49</code>"
      ],
      "a": 0,
      "why": "The file contains two records. Parsing the mark produces one pass and one fail."
    },
    {
      "q": "What does Java throws IOException do?",
      "opts": [
        "Catches every IOException automatically and then resumes the failed file read.",
        "Declares that the method may propagate that checked exception.",
        "Creates a new IOException object on every call even when the operation succeeds.",
        "Guarantees that the caller will always recover without writing any handling code."
      ],
      "a": 1,
      "why": "throws is a declaration, while try/catch performs handling."
    },
    {
      "q": "Which is the correct EOF condition for BufferedReader.readLine()?",
      "opts": [
        "The returned string is empty, because a blank line can never occur in a text file.",
        "The ready() method returns true, because readiness always means no more text exists.",
        "The returned value is null.",
        "The last line lacks a newline, because a final unterminated line must be discarded."
      ],
      "a": 2,
      "why": "An empty string represents a blank line. readLine also returns a final line without a trailing newline."
    },
    {
      "q": "Why keep the try block narrow around parsing?",
      "opts": [
        "So Java treats every checked exception as unchecked and stops checking the method.",
        "So the program never needs to validate the range of a successfully parsed value.",
        "So Python is forced to choose the same exception type for every possible error.",
        "So the handler covers the expected failure without hiding unrelated bugs."
      ],
      "a": 3,
      "why": "A specific handler and a small try block document exactly what can be recovered from."
    },
    {
      "q": "What does a context manager or try-with-resources contribute?",
      "opts": [
        "It closes the managed resource when its scope exits.",
        "It proves that file content is valid and every row contains the expected number of columns.",
        "It prevents every possible exception from occurring anywhere inside the managed block.",
        "It creates the missing input file automatically before a read-mode open is attempted."
      ],
      "a": 0,
      "why": "Resource lifetime management does not validate content or guarantee I/O success."
    }
  ]
};
