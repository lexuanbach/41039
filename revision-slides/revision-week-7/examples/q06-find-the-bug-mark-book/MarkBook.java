import java.util.ArrayList;
public class MarkBook {
    private ArrayList<Integer> marks
        = new ArrayList<Integer>();
    void add(int m) { marks.add(0, m); }
    void change(int i, int m) {
        marks.add(i, m);
    }
    boolean removeMark(int m) {
        return marks.remove(m);
    }
    int last() {
        return marks.get(marks.size());
    }
    public String toString() { return "" + marks; }
}
