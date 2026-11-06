public class Demo {
    public static void main(String[] args) {
        Ticket a = new Ticket();
        Ticket b = new Ticket();
        Ticket.issued = 10;
        Ticket c = new Ticket();
        Ticket d = b;
        System.out.println(a.number + " " + b.number);
        System.out.println(c.number + " " + d.number);
        System.out.println(Ticket.issued);
    }
}
class Ticket {
    static int issued = 0;
    final int number;
    Ticket() {
        issued++;
        number = issued;
    }
}
