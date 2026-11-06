public class Demo {
    public static void main(String[] args) {
        Order a = new Order("tea");
        Order b = new Order("coffee");
        System.out.println(a);
        System.out.println(b);
        System.out.println(new Order("cake"));
    }
}
class Order {
    // TODO: the shared counter
    private final int number;
    private final String item;
    Order(String item) {
        this.item = item;
        this.number = 0;  // TODO
    }
    public String toString() {
        return "";  // TODO
    }
}
