import java.util.*;
public class Demo {
    public static void main(String[] args) {
        String[] lines={"A,50","B,bad","C,85"};
        List<Integer> accepted=new ArrayList<Integer>();
        for(String line:lines) {
            try { accepted.add(Integer.parseInt(line.split(",")[1])); }
            catch(NumberFormatException e) { System.out.println("Invalid"); }
        }
        int total=0; for(int mark:accepted) total+=mark;
        System.out.println(accepted.size()+" "+total);
    }
}
