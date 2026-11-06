import java.util.*;

public class Demo {
    public static void main(String[] args) {
        List<Integer> xs = new ArrayList<Integer>();
        xs.add(7);                      // boxed
        xs.add(0, 4);                   // [4, 7]
        xs.remove(Integer.valueOf(7));  // [4]
        int first = xs.get(0);          // unboxed
        System.out.println(xs + " " + first);
    }
}
