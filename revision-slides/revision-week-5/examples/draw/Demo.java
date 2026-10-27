public class Demo {
    public static void main(String[] args) {
        Account a=new Account(100);
        Account b=a;
        Account c=new Account(100);
        b.deposit(50);
        System.out.println(a.balance+" "+b.balance+" "+c.balance);
        System.out.println((a==b)+" "+(a==c));
    }
}
class Account {
    int balance;
    Account(int balance) { this.balance=balance; }
    void deposit(int amount) { balance+=amount; }
}
