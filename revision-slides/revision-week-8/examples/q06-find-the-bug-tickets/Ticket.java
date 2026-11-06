interface Priced { int price(); }
public class Ticket implements Priced {
    protected final String film;
    Ticket(String film) { this.film = film; }
    int price() { return 15; }
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
