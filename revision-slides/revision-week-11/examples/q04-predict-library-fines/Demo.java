public class Demo {
    public static void main(String[] args) {
        Library a = new Library(new Daily());
        Library b = new Library(new Flat());
        System.out.println(a.fine(3) + " " + b.fine(3));
        System.out.println(a.fine(0) + " " + b.fine(9));
    }
}
interface Fee { int charge(int days); }
class Flat implements Fee {
    public int charge(int d) { return 5; }
}
class Daily implements Fee {
    public int charge(int d) { return 2 * d; }
}
class Library {
    private final Fee fee;
    Library(Fee fee) { this.fee = fee; }
    int fine(int daysLate) {
        if (daysLate <= 0) return 0;
        return fee.charge(daysLate);
    }
}
