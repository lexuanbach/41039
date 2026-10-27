public class Demo {
    public static void main(String[] args) {
        Line a=new Line(300,2);
        Line b=new Line(150,1);
        Order order=new Order(a,b);
        System.out.println(order.total());
    }
}
class Line {
    private final int cents,quantity;
    Line(int cents,int quantity) { this.cents=cents; this.quantity=quantity; }
    int subtotal() { return cents*quantity; }
}
class Order {
    private final Line a,b;
    Order(Line a,Line b) { this.a=a; this.b=b; }
    int total() { return a.subtotal()+b.subtotal(); }
}
