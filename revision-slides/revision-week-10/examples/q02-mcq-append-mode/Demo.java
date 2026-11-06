import java.io.*;

public class Demo {
    // s.txt starts with one line: old
    static void start() throws IOException {
        try (PrintWriter out = new PrintWriter("s.txt")) {
            out.println("old");
        }
    }

    // print every line of s.txt on one row
    static void show(String option) throws IOException {
        BufferedReader in = new BufferedReader(new FileReader("s.txt"));
        String text = option + ":";
        String line;
        while ((line = in.readLine()) != null) {
            text += " " + line;
        }
        in.close();
        System.out.println(text);
    }

    public static void main(String[] args) throws IOException {
        start();
        try (PrintWriter out =
                 new PrintWriter("s.txt")) {
            out.println("new");
        }
        show("A");

        start();
        try (PrintWriter out =
                 new PrintWriter(new FileWriter("s.txt"))) {
            out.println("new");
        }
        show("B");

        start();
        try (PrintWriter out =
                 new PrintWriter(new FileWriter("s.txt", true))) {
            out.println("new");
        }
        show("C");

        start();
        try (PrintWriter out =
                 new PrintWriter(new StringWriter())) {
            out.println("new");
        }
        show("D");
    }
}
