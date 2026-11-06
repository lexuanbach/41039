import java.io.*;
public class Demo {
    static String firstLine(String path) throws IOException {
        try (BufferedReader in = new BufferedReader(new FileReader(path))) {
            return in.readLine();
        }
    }
    public static void main(String[] args) {
        try {
            System.out.println(firstLine("notes.txt"));
        } catch (NumberFormatException e) {
            System.out.println("bad number");
        }
    }
}
