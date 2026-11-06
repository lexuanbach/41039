public class Demo {
    public static void main(String[] args) {
        Ticket a = new Ticket("Dune");
        Ticket b = new Student("Emma");
        System.out.println(a.label());
        System.out.println(b.label());
        Priced p = b;
        System.out.println(p.price());
    }
}
interface Priced { int price(); }
class Ticket implements Priced {
    protected final String film;
    Ticket(String film) { this.film = film; }
    public int price() { return 15; }
    String label() {
        return film + " $" + price();
    }
}
class Student extends Ticket {
    Student(String film) { super("film"); }
    public int price() { return price() - 5; }
    String label(int seat) {
        return "Student " + super.label();
    }
}
