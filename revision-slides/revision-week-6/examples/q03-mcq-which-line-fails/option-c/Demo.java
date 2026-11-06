public class Demo {
    public static void main(String[] args) {
        Account a = new Account();
        a.balance = 100;            // C
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
