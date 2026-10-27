import java.io.*;
public class Broken {
    public static void main(String[] args) {
        StringWriter buffer=new StringWriter();
        PrintWriter out=new PrintWriter(buffer);
        String[] names={"Linh","An"};
        int[] marks={85,49};
        out.println("name,mark");
        for(int i=0;i<names.length;i++) {
            out.println(names[i]+","+marks[i]);
        }
        out.close();
        System.out.print(buffer.toString());
    }
}
