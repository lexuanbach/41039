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
    private static int nextNumber = 1;
    private final int number;
    private final String item;
    Order(String item) {
        this.item = item;
        this.number = nextNumber;
        nextNumber++;
    }
    public String toString() {
        return "Order #" + number + ": " + item;
    }
}
