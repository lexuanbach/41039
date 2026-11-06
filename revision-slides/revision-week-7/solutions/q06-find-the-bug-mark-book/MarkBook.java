import java.util.ArrayList;
public class MarkBook {
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
