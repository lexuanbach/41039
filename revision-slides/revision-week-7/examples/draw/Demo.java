import java.util.*;
public class Demo {
    public static void main(String[] args) {
        List<Integer> a=new ArrayList<Integer>(Arrays.asList(4,1,4));
        List<Integer> b=a;
        List<Integer> c=new ArrayList<Integer>(a);
        b.remove(Integer.valueOf(4));
        c.set(0,9);
        System.out.println(a);
        System.out.println(b);
        System.out.println(c);
    }
}
