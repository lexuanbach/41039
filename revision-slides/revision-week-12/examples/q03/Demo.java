import java.io.*;

public class Demo {
    public static void main(String[] args) {
        String data="Linh,85\nAn,49\nMai,50";
        int count=0,passed=0;
        try(BufferedReader reader=new BufferedReader(new StringReader(data))) {
            String line;
            while((line=reader.readLine())!=null) {
                String[] parts=line.split(",");
                int mark=Integer.parseInt(parts[1]);
                count++;
                if(mark>=50) passed++;
            }
        } catch(IOException e) { throw new RuntimeException(e); }
        System.out.println("records="+count+", passed="+passed);
    }
}
