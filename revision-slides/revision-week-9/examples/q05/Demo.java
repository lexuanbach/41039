import java.io.*;

public class Demo {
    public static void main(String[] args) {
        try(BufferedReader reader=new BufferedReader(new StringReader("tea\n\ncoffee"))) {
            String line;
            int count=0;
            while((line=reader.readLine())!=null) {
                count++;
                System.out.println(count+": "+line);
            }
        } catch(IOException e) { System.out.println("Read failed"); }
    }
}
