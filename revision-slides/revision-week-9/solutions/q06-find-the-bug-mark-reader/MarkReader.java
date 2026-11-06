import java.io.*;
public class MarkReader {
    static int sumMarks(BufferedReader in) throws IOException {
        int total = 0, n = 0;
        String line;
        while ((line = in.readLine()) != null) {
            n++;
            if (line.isEmpty()) continue;
            try {
                total += Integer.parseInt(line);
            } catch (NumberFormatException e) {
                System.out.println("bad line " + n);
            }
        }
        return total;
    }
}
