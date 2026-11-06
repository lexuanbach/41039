public class Demo {
    public static void main(String[] args) {
        Stock s = new Stock();
        System.out.println(s.take(8));
    }
}
class Stock {
    private int count;
    boolean take(int n) {
        if (n <= 0 || n > count) return false;
        count -= n;
        return true;
    }
}
