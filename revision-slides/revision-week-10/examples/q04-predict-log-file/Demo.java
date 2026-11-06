import java.io.*;

public class Demo {
    public static void main(String[] args) throws IOException {
        try (PrintWriter out = new PrintWriter("log.txt")) {
            out.print("A");
            out.println("B");
            out.print("C");
        }
        try (PrintWriter out = new PrintWriter(
                 new FileWriter("log.txt", true))) {
            out.println("D");
        }
        BufferedReader in = new BufferedReader(
            new FileReader("log.txt"));
        String line;
        int n = 0;
        while ((line = in.readLine()) != null) {
            n++;
            System.out.println(n + ": " + line);
        }
        in.close();
    }
}
