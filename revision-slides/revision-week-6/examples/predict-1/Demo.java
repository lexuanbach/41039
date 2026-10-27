public class Demo {
    public static void main(String[] args) {
        Counter a=new Counter();
        Counter b=new Counter();
        a.click(); b.click(); b.click();
        Counter c=b;
        c.click();
        System.out.println(a.mine+" "+b.mine+" "+Counter.total);
        System.out.println(c==b);
    }
}
class Counter {
    static int total=0;
    int mine=0;
    void click() { total++; mine++; }
}
