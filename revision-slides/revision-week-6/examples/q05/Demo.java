public class Demo {
    public static void main(String[] args) {
        Ticket a = new Ticket();
        Ticket b = new Ticket();
        System.out.println(a.number + " " + b.number + " " + Ticket.count);
    }
}
class Ticket {
    static int count = 0;
    final int number;
    Ticket() { number = ++count; }
}
