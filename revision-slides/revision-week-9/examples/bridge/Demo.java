import java.io.*;
// Looking ahead: read marks (this week), then save a report (next week).
// Shows that text sits in a buffer until the writer is closed.
public class Demo {
    static int countLines(String path) throws IOException {
        try (BufferedReader in = new BufferedReader(new FileReader(path))) {
            int n = 0;
            while (in.readLine() != null) n++;
            return n;
        }
    }
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new StringReader("Linh,85\nMai,70"));
        int total = 0, n = 0;
        String line;
        while ((line = in.readLine()) != null) {
            total += Integer.parseInt(line.split(",")[1]);
            n++;
        }
        System.out.println(n + " marks, total " + total);

        PrintWriter out = new PrintWriter("report.txt", "UTF-8");
        out.println("marks," + n);
        out.println("total," + total);
        System.out.println("before close: " + countLines("report.txt") + " lines");
        out.close();
        System.out.println("after close: " + countLines("report.txt") + " lines");
    }
}
