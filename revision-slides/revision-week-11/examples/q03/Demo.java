public class Demo {
    public static void main(String[] args) {
        Basket basket=new Basket(new StudentPrice());
        System.out.println(basket.price(1000));
    }
}
interface PriceRule { int apply(int cents); }
class StudentPrice implements PriceRule {
    public int apply(int cents) { return cents*80/100; }
}
class Basket {
    private final PriceRule rule;
    Basket(PriceRule rule) { this.rule=rule; }
    int price(int cents) { return rule.apply(cents); }
}
