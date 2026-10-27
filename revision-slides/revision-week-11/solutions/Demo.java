import java.util.*;

public class Demo {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int n=sc.nextInt();
        Order order=new Order();
        for(int i=0;i<n;i++) order.add(new Line(sc.nextInt(),sc.nextInt()));
        System.out.println(order.total());
    }
}
class Line {
    private final int price,quantity;
    Line(int price,int quantity) { this.price=price; this.quantity=quantity; }
    int subtotal() { return price*quantity; }
}
class Order {
    private final List<Line> lines=new ArrayList<Line>();
    void add(Line line) { lines.add(line); }
    int total() { int total=0; for(Line line:lines) total+=line.subtotal(); return total; }
}
