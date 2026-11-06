public class Demo {
    public static void main(String[] args) {
        BoundedCounter c = new BoundedCounter(2);
        System.out.println(c.increment() + " "
            + c.increment() + " " + c.increment());
        System.out.println(c.getValue());
        c.reset();
        System.out.println(c.getValue());
    }
}
class BoundedCounter {
    private final int max;
    private int value = 0;
    BoundedCounter(int max) {
        this.max = max;
    }
    boolean increment() {
        if (value >= max) return false;
        value++;
        return true;
    }
    void reset() { value = 0; }
    int getValue() { return value; }
}
