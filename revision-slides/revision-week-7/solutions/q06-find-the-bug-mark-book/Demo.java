import java.util.ArrayList;

public class Demo {
    public static void main(String[] args) {
        MarkBook b = new MarkBook();
        b.add(70); b.add(40); b.add(90);
        b.change(1, 45);
        System.out.println(b.removeMark(90) + " "
            + b.removeMark(12));
        System.out.println(b + " " + b.last());
    }
}
class MarkBook {
    private ArrayList<Integer> marks
        = new ArrayList<Integer>();
    void add(int m) { marks.add(m); }
    void change(int i, int m) {
        marks.set(i, m);
    }
    boolean removeMark(int m) {
        return marks.remove(Integer.valueOf(m));
    }
    int last() {
        return marks.get(marks.size() - 1);
    }
    public String toString() { return "" + marks; }
}
