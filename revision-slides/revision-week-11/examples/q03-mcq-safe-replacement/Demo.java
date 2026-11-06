import java.util.ArrayList;

public class Demo {
    // in class Demo: works with ANY Tally
    static int check(Tally t) {
        t.add(5);
        t.add(3);
        return t.total();
    }
    public static void main(String[] args) {
        System.out.println("A " + check(new Sum()));
        System.out.println("B " + check(new ListTally()));
        System.out.println("C " + check(new LastTally()));
        System.out.println("D " + check(new CountTally()));
    }
}
interface Tally {
    // Promise: total() is the sum of
    // every n given to add(n).
    void add(int n);
    int total();
}
// A: a running sum
class Sum implements Tally {
    private int s = 0;
    public void add(int n) { s += n; }
    public int total() { return s; }
}
// B: stores each n in a list, adds them up in total()
class ListTally implements Tally {
    private final ArrayList<Integer> all = new ArrayList<>();
    public void add(int n) { all.add(n); }
    public int total() {
        int s = 0;
        for (int n : all) s += n;
        return s;
    }
}
// C: keeps only the last n
class LastTally implements Tally {
    private int last = 0;
    public void add(int n) { last = n; }
    public int total() { return last; }
}
// D: like Sum, plus a new method count()
class CountTally implements Tally {
    private int s = 0, calls = 0;
    public void add(int n) { s += n; calls++; }
    public int total() { return s; }
    public int count() { return calls; }
}
