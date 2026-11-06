import java.io.*;
public class Demo {
    public static void main(String[] args) throws IOException {
        String text = "50\n\nabc\n30\nxyz\n20";
        BufferedReader in = new BufferedReader(new StringReader(text));
        System.out.println(MarkReader.sumMarks(in));
    }
}
// Only the compile error is fixed (throws IOException on line 3). The 3 logic bugs remain.
class MarkReader {
    static int sumMarks(BufferedReader in) throws IOException {
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
