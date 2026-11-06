interface Priced { int price(); }
public class Ticket implements Priced {
    protected final String film;
    Ticket(String film) { this.film = film; }
    public int price() { return 15; }
    String label() {
        return film + " $" + price();
    }
}
class Student extends Ticket {
    Student(String film) { super(film); }
    public int price() { return super.price() - 5; }
    @Override String label() {
        return "Student " + super.label();
    }
}
