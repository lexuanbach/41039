public class Demo {
    enum Size { SMALL, MEDIUM, LARGE }

    static int price(Size s) {
        int p = 0;
        switch (s) {
            case SMALL:  p = 3;
            case MEDIUM: p = 4; break;
            case LARGE:  p = 5;
        }
        return p;
    }

    public static void main(String[] args) {
        for (Size s : Size.values())
            System.out.print(s + "=" + price(s) + " ");
        System.out.println(
            Size.valueOf("LARGE").ordinal());
    }
}
