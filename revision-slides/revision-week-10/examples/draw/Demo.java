import java.io.*;
public class Demo {
    public static void main(String[] args) {
        int[] marks={85,49,50};
        int total=0,passed=0;
        for(int mark:marks) { total+=mark; if(mark>=50) passed++; }
        StringWriter text=new StringWriter();
        try(PrintWriter out=new PrintWriter(text)) {
            out.println("count,total,passed");
            out.println(marks.length+","+total+","+passed);
        }
        System.out.print(text.toString());
    }
}
