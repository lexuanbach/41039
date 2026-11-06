import java.io.*;
public class Demo {
    public static void main(String[] args) throws IOException {
        String text = "50\n\nabc\n30\nxyz\n20";
        BufferedReader in = new BufferedReader(new StringReader(text));
        System.out.println(MarkReader.sumMarks(in));
    }
}
class MarkReader {
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
