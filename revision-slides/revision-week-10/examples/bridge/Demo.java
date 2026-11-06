import java.io.*;

public class Demo {
    // print every line of a file
    static void show(String file) throws IOException {
        BufferedReader in = new BufferedReader(new FileReader(file));
        String line;
        while ((line = in.readLine()) != null) {
            System.out.println(line);
        }
        in.close();
    }

    public static void main(String[] args) throws IOException {
        int[] marks = {85, 49, 50};

        // Last week: one method calculates, formats and saves
        new ReportJob().run(marks);
        show("r.csv");

        // Each job in its own class; the caller picks the destination
        MarkList list = new MarkList(marks);
        String text = new CsvReport().format(list);
        try (PrintWriter out = new PrintWriter("r2.csv")) {
            out.print(text);
        }
        show("r2.csv");
    }
}

class ReportJob {
    void run(int[] marks) throws IOException {
        int passed = 0;
        for (int m : marks) if (m >= 50) passed++;
        try (PrintWriter out =
                 new PrintWriter("r.csv")) {
            for (int m : marks) out.println(m);
            out.println("passed," + passed);
        }
    }
}

class MarkList {     // knows the marks
    private final int[] marks;
    MarkList(int[] marks) { this.marks = marks; }
    int size() { return marks.length; }
    int get(int i) { return marks[i]; }
    int passed() {
        int p = 0;
        for (int m : marks) if (m >= 50) p++;
        return p;
    }
}

class CsvReport {    // knows the format
    String format(MarkList list) {
        String text = "";
        for (int i = 0; i < list.size(); i++)
            text += list.get(i) + "\n";
        return text + "passed," + list.passed() + "\n";
    }
}
