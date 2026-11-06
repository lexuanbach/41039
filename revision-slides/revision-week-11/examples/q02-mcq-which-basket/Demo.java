public class Demo {
    public static void main(String[] args) {
        // Half is new. Without editing any Basket, only Version 3 can be given it.
        BasketV1 v1 = new BasketV1();  // only "student or not"
        BasketV2 v2 = new BasketV2();       // always StudentPrice
        BasketV3 v3 = new BasketV3(new Half());
        System.out.println(v1.price(1000, false) + " " + v2.price(1000) + " " + v3.price(1000));
    }
}
interface PriceRule { int apply(int cents); }
class StudentPrice implements PriceRule {
    public int apply(int cents) { return cents * 80 / 100; }
}
class Half implements PriceRule {
    public int apply(int cents) { return cents / 2; }
}
// Version 1
class BasketV1 {
    int price(int c,
              boolean student) {
        if (student)
            return c * 80 / 100;
        return c;
    }
}
// Version 2
class BasketV2 {
    private PriceRule rule =
        new StudentPrice();
    int price(int c) {
        return rule.apply(c);
    }
}
// Version 3
class BasketV3 {
    private PriceRule rule;
    BasketV3(PriceRule r) {
        rule = r;
    }
    int price(int c) {
        return rule.apply(c);
    }
}
