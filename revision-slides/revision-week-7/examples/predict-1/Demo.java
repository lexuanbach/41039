import java.util.*;
public class Demo {
    public static void main(String[] args) {
        List<Integer> xs=new ArrayList<Integer>(Arrays.asList(1,2,1));
        xs.remove(1);
        xs.add(1,4);
        System.out.println(xs);
        xs.remove(Integer.valueOf(1));
        System.out.println(xs);
        System.out.println(xs.size());
    }
}
