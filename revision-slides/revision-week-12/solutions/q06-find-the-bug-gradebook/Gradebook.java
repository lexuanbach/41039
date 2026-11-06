public class Gradebook {
    private int count, total, passed;
    public boolean add(int mark) {
        if (mark < 0 || mark > 100) return false;
        count++;
        total += mark;
        if (mark >= 50) passed++;
        return true;
    }
    public int getCount() { return count; }
    public int getPassed() { return passed; }
    public double average() {
        double avg = 0;
        if (count > 0) avg = (double) total / count;
        return avg;
    }
}
