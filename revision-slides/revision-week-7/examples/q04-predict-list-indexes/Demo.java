import java.util.*;

public class Demo {
    public static void main(String[] args) {
        List<Integer> xs = new ArrayList<Integer>();
        xs.add(10);
        xs.add(20);
        xs.add(0, 30);
        xs.set(1, 20);
        xs.add(xs.size(), 2);
        System.out.println(xs + " " + xs.size());
        xs.remove(2);
        System.out.println(xs);
        xs.remove(Integer.valueOf(2));
        System.out.println(xs + " " + xs.get(1));
    }
}
