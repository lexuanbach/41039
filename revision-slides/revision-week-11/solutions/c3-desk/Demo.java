public class Demo {
    public static void main(String[] args) {
        Stock books = new Stock(1);
        Desk front = new Desk(books);
        Desk back = new Desk(books);
        System.out.println(front.borrow("An"));
        System.out.println(back.borrow("Binh"));
        System.out.println(books.take());
    }
}
class Stock {
    private int count;
    Stock(int n) { count = n; }
    boolean take() {
        if (count == 0) return false;
        count--;
        return true;
    }
}
class Desk {
    private final Stock stock;
    Desk(Stock stock) { this.stock = stock; }
    String borrow(String name) {
        if (stock.take()) return name + " borrowed";
        return name + ": none left";
    }
}
