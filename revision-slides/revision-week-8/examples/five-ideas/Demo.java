public class Demo {
    public static void main(String[] args) {
        Item x = new Book("Dune");
        System.out.println(x.cost());
    }
}
interface Priced { int cost(); }
abstract class Item implements Priced {
    final String name;
    Item(String n) { name = n; }
}
class Book extends Item {
    Book(String n) { super(n); }
    @Override public int cost() { return 20; }
}
