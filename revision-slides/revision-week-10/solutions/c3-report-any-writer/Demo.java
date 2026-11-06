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
    static boolean write(PrintWriter out,
                         String[] rows) {
        out.println("name,mark");
        for (String r : rows) {
            out.println(r);
        }
        out.println("count," + rows.length);
        return !out.checkError();
    }
}
