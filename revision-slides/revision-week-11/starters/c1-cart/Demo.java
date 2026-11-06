import java.util.*;

public class Demo {
    public static void main(String[] args) {
        Cart c = new Cart();
        System.out.println(c.total());
        c.add(new Item(250, 2));
        c.add(new Item(120, 5));
        c.add(new Item(999, 0));
        System.out.println(c.total());
    }
}
class Item {
    private final int cents, qty;
    Item(int c, int q) { cents = c; qty = q; }
    int cost() { return 0; }  // TODO
}
class Cart {
    private List<Item> items = new ArrayList<>();
    void add(Item i) { items.add(i); }
    int total() {
        return 0;  // TODO
    }
}
