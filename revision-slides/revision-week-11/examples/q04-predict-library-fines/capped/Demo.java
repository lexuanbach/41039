public class Demo {
    public static void main(String[] args) {
        // A new rule: 1 per day, at most 4. Library is unchanged.
        Library c = new Library(new Capped());
        System.out.println(c.fine(3) + " " + c.fine(9) + " " + c.fine(0));
    }
}
interface Fee { int charge(int days); }
class Capped implements Fee {
    public int charge(int days) { return Math.min(days, 4); }
}
class Library {
    private final Fee fee;
    Library(Fee fee) { this.fee = fee; }
    int fine(int daysLate) {
        if (daysLate <= 0) return 0;
        return fee.charge(daysLate);
    }
}
