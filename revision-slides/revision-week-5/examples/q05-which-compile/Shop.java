public class Shop {
    static int opened = 0;
    String name;

    void rename(String n) {        // (a)
        name = n;
        opened++;
    }
    static String label() {        // (b)
        return name;
    }
    static String sample() {       // (c)
        Shop s = new Shop();
        return s.name;
    }
}
