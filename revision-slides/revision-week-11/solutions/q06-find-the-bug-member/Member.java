import java.util.*;
class Loan {
    private final int due;
    Loan(int due) { this.due = due; }
    boolean isLate(int day) { return day > due; }
}
public class Member {
    private List<Loan> loans = new ArrayList<>();
    List<Loan> getLoans() { return new ArrayList<>(loans); }
    boolean borrow(Loan l) {
        if (loans.size() >= 3) return false;
        loans.add(l);
        return true;
    }
    int countLate(int day) {
        int n = 0;
        for (Loan l : loans) if (l.isLate(day)) n++;
        return n;
    }
}
