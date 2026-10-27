public class Demo {
    public static void main(String[] args) {
        java.util.Scanner sc = new java.util.Scanner(System.in);
        Inventory item = new Inventory(sc.nextInt());
        int n = sc.nextInt();
        for (int i=0;i<n;i++) System.out.println(item.take(sc.nextInt()) ? "OK" : "Refused");
        System.out.println(item.available());
    }
}
class Inventory {
    private int stock;
    Inventory(int stock) { this.stock = stock; }
    boolean take(int amount) {
        if (amount <= 0 || amount > stock) return false;
        stock -= amount;
        return true;
    }
    int available() { return stock; }
}
