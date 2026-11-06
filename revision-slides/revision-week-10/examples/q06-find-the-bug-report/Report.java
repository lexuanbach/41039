import java.io.*;
public class Report {
    // header, a line per student, pass count
    static void save(String f, String[] names,
                     int[] marks) {
        FileWriter fw = new FileWriter(f);
        PrintWriter out = new PrintWriter(fw);
        out.println("name,mark");
        int passed = 0;
        for (int i = 0; i < names.length; i++) {
            out.print(names[i] + "," + marks[i]);
            if (marks[i] > 50) passed++;
        }
        out.println("passed," + passed);
    }
}
