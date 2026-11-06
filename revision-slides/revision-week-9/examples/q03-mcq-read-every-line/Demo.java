import java.io.*;
// Q3: the three loops, each run on its own reader over "tea\n\ncoffee".
// Each printed line is shown between [ and ] so the blank line is visible.
public class Demo {
    static BufferedReader open() {
        return new BufferedReader(new StringReader("tea\n\ncoffee"));
    }
    static void show(String line) { System.out.println("[" + line + "]"); }

    public static void main(String[] args) throws IOException {
        BufferedReader in = open();
        System.out.println("Version 1");
        String line;
        while ((line = in.readLine())
                != null) {
            show(line);
        }

        in = open();
        System.out.println("Version 2");
        line = in.readLine();
        while (!line.isEmpty()) {
            show(line);
            line = in.readLine();
        }

        in = open();
        System.out.println("Version 3");
        line = in.readLine();
        while (line != null) {
            show(line);
            line = in.readLine();
        }
    }
}
