public class Demo {
    public static void main(String[] args) {
        Order order=new Order();
        order.add(new Line(300,2));
        order.add(new Line(150,1));
        System.out.println(order.total());
    }
}
class Line {
    private final int cents,quantity;
    Line(int cents,int quantity) { this.cents=cents; this.quantity=quantity; }
    int subtotal() { return cents*quantity; }
}
class Order {
    private final java.util.List<Line> lines=new java.util.ArrayList<Line>();
    void add(Line line) { lines.add(line); }
    int total() { int sum=0; for(Line line:lines) sum+=line.subtotal(); return sum; }
}
