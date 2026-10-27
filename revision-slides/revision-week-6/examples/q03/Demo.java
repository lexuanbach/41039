public class Demo {
    public static void main(String[] args) {
        Stock a = new Stock(5);
        Stock b = a;
        b.take(2);
        System.out.println(a.getStock());
        System.out.println(a == b);
    }
}
class Stock {
    private int stock;
    Stock(int stock) { this.stock = stock; }
    void take(int amount) { stock -= amount; }
    int getStock() { return stock; }
}
