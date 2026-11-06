public class Demo {
    public static void main(String[] args) {
        System.out.println(Shop.sample());
    }
}
class Shop {
    static int opened = 0;
    String name;

    void rename(String n) {        // (a)
        name = n;
        opened++;
    }
    static String sample() {       // (c)
        Shop s = new Shop();
        return s.name;
    }
}
