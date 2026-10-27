import java.util.*;
public class Demo {
    static int count(List<Integer> xs) { int n=0; for(int x:xs) if(x>=50) n++; return n; }
    public static void main(String[] args) {
        List<Integer> a=new ArrayList<Integer>(Arrays.asList(49,50,85));
        List<Integer> b=a;
        List<Integer> c=new ArrayList<Integer>(a);
        b.remove(Integer.valueOf(49));
        c.set(0,0);
        System.out.println(a);
        System.out.println(c);
        System.out.println(count(a));
    }
}
