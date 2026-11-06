import java.util.ArrayList;
import java.util.Arrays;

public class Demo {
    public static void main(String[] args) {
        ArrayList<Integer> marks = new ArrayList<>(
            Arrays.asList(49, 50, 120, 85, -3));
        Check valid = new InRange(0, 100);
        Check pass = new InRange(50, 100);
        System.out.println(keep(marks, valid));
        System.out.println(keep(marks, pass));
        System.out.println(marks);
    }
    static ArrayList<Integer> keep(
            ArrayList<Integer> marks, Check c) {
        ArrayList<Integer> result = new ArrayList<>();
        for (int m : marks)
            if (c.ok(m)) result.add(m);
        return result;
    }
}
interface Check { boolean ok(int mark); }
class InRange implements Check {
    private final int lo, hi;
    InRange(int lo, int hi) {
        this.lo = lo; this.hi = hi;
    }
    public boolean ok(int mark) {
        return lo <= mark && mark <= hi;
    }
}
