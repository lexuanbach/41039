import java.util.*;

public class Demo {
    static int total(List<Integer> xs) {
        int sum = 0;
        for (int x : xs) sum += x;
        return sum;
    }
    public static void main(String[] args) {
        List<Integer> a = new ArrayList<Integer>();
        a.add(2); a.add(3);
        List<Integer> b = new LinkedList<Integer>(a);
        b.add(5);
        System.out.println(total(a) + " " + total(b));
    }
}
