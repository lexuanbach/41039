import java.io.*;
import java.nio.file.*;
public class Demo {
    static String firstLine(String path) throws IOException {
        try (BufferedReader in = new BufferedReader(new FileReader(path))) {
            return in.readLine();
        }
    }
    public static void main(String[] args) throws IOException {
        // make the input file first, so the program needs nothing from outside
        Files.write(Paths.get("notes.txt"), "Buy milk\nCall Linh\n".getBytes("UTF-8"));
        System.out.println(firstLine("notes.txt"));
    }
}
