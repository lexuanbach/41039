public class Demo {
    public static void main(String[] args) {
        Stock s = new Stock();
        s.count = 5;
        s.count -= 8;
        System.out.println(s.count);   // -3
    }
}
class Stock {
    int count;
}
