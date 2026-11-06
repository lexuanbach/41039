import java.io.*;

public class Demo {
    public static void main(String[] args) {
        StringWriter mem = new StringWriter();
        PrintWriter out = new PrintWriter(mem);
        String[] rows = {"An,85", "Binh,49"};
        System.out.println(Report.write(out, rows));
        System.out.print(mem);
        out.close();
        System.out.println(Report.write(out, rows));
    }
}
class Report {
    // header, each row, then the count
    static boolean write(PrintWriter out,
                         String[] rows) {
        // TODO
        return false;
    }
}
