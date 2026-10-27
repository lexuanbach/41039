import java.io.*;
public class Demo {
    public static void main(String[] args) {
        StringWriter buffer=new StringWriter();
        try(PrintWriter out=new PrintWriter(buffer)) {
            out.print("A");
            out.println("B");
            out.println("C");
        }
        System.out.print(buffer.toString());
        System.out.println("D");
    }
}
