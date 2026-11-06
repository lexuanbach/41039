import java.io.*;
public class Demo {
    static String firstLine(String path) throws IOException {
        try (BufferedReader in = new BufferedReader(new FileReader(path))) {
            return in.readLine();
        }
    }
    public static void main(String[] args) throws IOException {
        System.out.println(firstLine("notes.txt"));
    }
}
// Option C with no notes.txt: it compiles, but nobody catches the exception,
// so the program stops with a stack trace.
