public class Demo {
    public static void main(String[] args) {
        Stock item = new Stock(4);
        System.out.println(item.take(3));
        System.out.println(item.take(2));
        System.out.println(item.getStock());
    }
}
class Stock {
    private int stock;
    Stock(int stock) { this.stock = stock; }
    boolean take(int amount) {
        if (amount <= 0 || amount > stock) return false;
        stock = stock - amount;
        return true;
    }
    int getStock() { return stock; }
}
