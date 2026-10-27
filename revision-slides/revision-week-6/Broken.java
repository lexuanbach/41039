public class Broken {
    public static void main(String[] args) {
        Stock s=new Stock(4);
        System.out.println(s.take(0));
        System.out.println(s.take(4));
        System.out.println(s.take(1));
        System.out.println(s.left());
    }
}
class Stock {
    private int count;
    Stock(int count) { this.count=count; }
    boolean take(int n) {
        if(n<0 || n>=count) return false;
        count-=n;
        return false;
    }
    int left() { return count; }
}
