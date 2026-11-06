public class Demo {
    public static void main(String[] args) {
        Gradebook g = new Gradebook();
        System.out.println(g.add(50) + " "
            + g.add(-5) + " " + g.add(75));
        System.out.println(g.getCount() + " "
            + g.getPassed());
        System.out.println(g.average());
    }
}
class Gradebook {
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
