import java.io.*;

public class Demo {
    public static void main(String[] args) throws IOException {
        String[] names = {"An", "Binh", "Chi"};
        int[] marks = {50, 49, 90};
        Report.save("r.csv", names, marks);
        // then print every line of r.csv
        BufferedReader in = new BufferedReader(new FileReader("r.csv"));
        String line;
        while ((line = in.readLine()) != null) {
            System.out.println(line);
        }
        in.close();
    }
}
class Report {
    // header, a line per student, pass count
    static void save(String f, String[] names,
                     int[] marks) throws IOException {
        try (PrintWriter out =
                 new PrintWriter(new FileWriter(f))) {
            out.println("name,mark");
            int passed = 0;
            for (int i = 0; i < names.length; i++) {
                out.println(names[i] + "," + marks[i]);
                if (marks[i] >= 50) passed++;
            }
            out.println("passed," + passed);
        }
    }
}
