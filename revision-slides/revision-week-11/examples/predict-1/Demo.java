public class Demo {
    static int charge(Price rule,int cents) { return rule.apply(cents); }
    public static void main(String[] args) {
        Price[] rules={new Regular(),new Half()};
        for(Price rule:rules) System.out.println(charge(rule,101));
    }
}
interface Price { int apply(int cents); }
class Regular implements Price {
    public int apply(int cents) { return cents; }
}
class Half implements Price {
    public int apply(int cents) { return cents/2; }
}
