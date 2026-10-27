import java.util.Scanner;

public class Bank {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        BankAccount acc = new BankAccount(sc.nextInt());

        String command = sc.next();
        while (!command.equals("Q")) {
            int amount = sc.nextInt();
            boolean ok;
            if (command.equals("D")) {
                ok = acc.deposit(amount);
            } else {
                ok = acc.withdraw(amount);
            }
            System.out.println(ok ? "OK" : "Refused");
            command = sc.next();
        }
        System.out.println("Balance: " + acc.getBalance());
    }
}

class BankAccount {

    private int balance;

    public BankAccount(int startingBalance) {
        this.balance = startingBalance;
    }

    public boolean deposit(int cents) {
        if (cents <= 0) {
            return false;
        }
        this.balance += cents;
        return true;
    }

    public boolean withdraw(int cents) {
        if (cents <= 0 || cents > this.balance) {
            return false;
        }
        this.balance -= cents;
        return true;
    }

    public int getBalance() {
        return this.balance;
    }
}
