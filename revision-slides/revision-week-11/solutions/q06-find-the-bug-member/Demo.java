import java.util.*;
public class Demo {
    public static void main(String[] args) {
        Member m = new Member();
        m.borrow(new Loan(10));
        m.borrow(new Loan(12));
        System.out.println(m.countLate(10));
        m.borrow(new Loan(20));
        System.out.println(m.borrow(new Loan(20)));
        m.getLoans().clear();
        System.out.println(m.getLoans().size());
    }
}
class Loan {
    private final int due;
    Loan(int due) { this.due = due; }
    boolean isLate(int day) { return day > due; }
}
class Member {
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
