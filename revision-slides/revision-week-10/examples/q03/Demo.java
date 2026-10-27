import java.io.*;

public class Demo {
    public static void main(String[] args) throws IOException {
        File file=new File("report.txt");
        try(PrintWriter out=new PrintWriter(file,"UTF-8")) {
            out.println("name,mark");
            out.println("Linh,85");
            if(out.checkError()) throw new IOException("write failed");
        }
        try(BufferedReader in=new BufferedReader(new InputStreamReader(new FileInputStream(file),"UTF-8"))) {
            String line;
            while((line=in.readLine())!=null) System.out.println(line);
        }
    }
}
