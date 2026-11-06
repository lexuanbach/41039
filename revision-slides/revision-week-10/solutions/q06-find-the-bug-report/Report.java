import java.io.*;
public class Report {
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
