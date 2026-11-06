import java.util.*;

public class Demo {
    static List<Integer> start() {
        return new ArrayList<Integer>(Arrays.asList(4, -1, -2, 5));
    }
    public static void main(String[] args) {
        // Version 1
        List<Integer> xs = start();
        for (int i = 0;
             i < xs.size(); i++)
            if (xs.get(i) < 0)
                xs.remove(i);
        System.out.println("V1 " + xs);
        // Version 2
        xs = start();
        for (int i = xs.size() - 1;
             i >= 0; i--)
            if (xs.get(i) < 0)
                xs.remove(i);
        System.out.println("V2 " + xs);
        // Version 3
        xs = start();
        Iterator<Integer> it
            = xs.iterator();
        while (it.hasNext())
            if (it.next() < 0)
                it.remove();
        System.out.println("V3 " + xs);
    }
}
