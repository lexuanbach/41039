import java.io.*;
public class MarkReader {
    static int sumMarks(BufferedReader in) {
        int total = 0, n = 0;
        String line;
        try {
            while ((line = in.readLine()) != null) {
                if (line.isEmpty()) break;
                n++;
                total += Integer.parseInt(line);
            }
        } catch (NumberFormatException e) {
            System.out.println("bad line " + n);
        }
        return total;
    }
}
