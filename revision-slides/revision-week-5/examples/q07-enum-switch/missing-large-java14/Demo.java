public class Demo {
    enum Size { SMALL, MEDIUM, LARGE }

    static int price(Size s) {
        return switch (s) {
            case SMALL  -> 3;
            case MEDIUM -> 4;
        };
    }

    public static void main(String[] args) {
        for (Size s : Size.values())
            System.out.print(s + "=" + price(s) + " ");
        System.out.println(
            Size.valueOf("LARGE").ordinal());
    }
}
