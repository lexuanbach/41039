import java.io.*;
public class Broken {
    public static void main(String[] args) {
        StringWriter buffer=new StringWriter();
        PrintWriter out=new PrintWriter(buffer);
        String[] names={"Linh","An"};
        int[] marks={85,49};
        out.print("name,mark");
        for(int i=0;i<names.length;i++) {
            out.print(names[i]+marks[i]);
        }
        System.out.print(buffer.toString());
    }
}
