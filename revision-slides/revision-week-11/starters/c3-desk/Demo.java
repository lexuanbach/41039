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
        return false;  // TODO
    }
}
class Desk {
    // TODO: the Stock this desk uses
    Desk(Stock stock) { /* TODO */ }
    String borrow(String name) {
        return "";  // TODO
    }
}
