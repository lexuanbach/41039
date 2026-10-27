public class Counter {
    private static int total = 0;
    private int mine = 0;

    public void click() {
        total++;
        mine++;
    }

    public static void main(String[] args) {
        Counter a = new Counter();
        Counter b = new Counter();
        a.click();
        a.click();
        b.click();
        System.out.println(a.mine + " " + b.mine + " " + total);
    }
}
