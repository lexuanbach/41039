import java.io.*;

public class Demo {
    public static void main(String[] args) {
        StringWriter buffer=new StringWriter();
        try(PrintWriter writer=new PrintWriter(buffer)) {
            writer.println("name,mark");
            writer.println("Linh,85");
        }
        System.out.print(buffer.toString());
    }
}
