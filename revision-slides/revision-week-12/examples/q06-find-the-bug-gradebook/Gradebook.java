public class Gradebook {
    private int count, total, passed;
    public boolean add(int mark) {
        count++;
        if (mark < 0 || mark > 100) return false;
        total += mark;
        if (mark > 50) passed++;
        return true;
    }
    public int getCount() { return count; }
    public int getPassed() { return passed; }
    public double average() {
        double avg;
        if (count > 0) avg = total / count;
        return avg;
    }
}
