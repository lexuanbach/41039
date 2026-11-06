public class Demo {
    public static void main(String[] args) {
        Account a = new Account();
        a.deposit(50);              // A
        Account.created = 7;        // B
        int b = a.getBalance();     // D
        System.out.println(b + " " + Account.created);
    }
}
class Account {
    private int balance = 0;
    static int created = 0;
    Account() { created++; }
    void deposit(int n) {
        if (n > 0) balance += n;
    }
    int getBalance() { return balance; }
}
