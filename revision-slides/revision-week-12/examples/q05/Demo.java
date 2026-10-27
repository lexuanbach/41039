public class Demo {
    public static void main(String[] args) {
        Counter counter=new Counter(2);
        System.out.println(counter.take(0));
        System.out.println(counter.take(2));
        System.out.println(counter.take(1));
        System.out.println(counter.left());
    }
}
class Counter {
    private int count;
    Counter(int count) { this.count=count; }
    boolean take(int n) {
        if(n<=0 || n>count) return false;
        count-=n;
        return true;
    }
    int left() { return count; }
}
