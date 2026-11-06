import java.util.ArrayList;

public class Demo {
    public static void main(String[] args) {
        Recent<String> r = new Recent<String>(3);
        r.add("tea"); r.add("milk");
        r.add("jam"); r.add("egg");
        System.out.println(r + " " + r.latest());
        Recent<Integer> n = new Recent<Integer>(2);
        System.out.println(n.latest());
        n.add(7); n.add(8); n.add(9);
        System.out.println(n + " " + n.latest());
    }
}
class Recent<T> {
    private final int max;
    private final ArrayList<T> items
        = new ArrayList<T>();
    Recent(int max) { this.max = max; }
    void add(T item) { /* TODO */ }
    T latest() {
        return null;  // TODO
    }
    public String toString() {
        return items.toString();
    }
}
