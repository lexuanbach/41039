public class Broken {
    public static void main(String[] args) {
        Checkout c=new Checkout(new HalfPrice());
        System.out.println(c.total(1000));
    }
}
interface Pricing { int apply(int cents); }
class Regular implements Pricing {
    public int apply(int cents) { return cents; }
}
class HalfPrice implements Pricing {
    public int apply(int cents) { return cents/2; }
}
class Checkout {
    private final Pricing rule;
    Checkout(Pricing rule) { this.rule=new Regular(); }
    int total(int cents) {
        System.out.println("charging");
        return rule.apply(cents);
    }
}
