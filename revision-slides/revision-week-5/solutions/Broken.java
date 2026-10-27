public class Broken {
    public static void main(String[] args) {
        Account a=new Account(100);
        Account b=new Account(200);
        a.deposit(50);
        System.out.println(a.balance()+" "+b.balance());
    }
}
class Account {
    private int cents;
    Account(int cents) { this.cents=cents; }
    void deposit(int amount) { cents+=amount; }
    int balance() { return cents; }
}
