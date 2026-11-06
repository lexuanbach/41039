public class Demo {
    enum Size {
        // TODO: give them 250, 350, 500 ml
        SMALL, MEDIUM, LARGE;
        // TODO: a private final field ml,
        // and a constructor that sets it
        int ml() {
            return 0;  // TODO
        }
        Size bigger() {
            return this;  // TODO
        }
    }

    public static void main(String[] args) {
        System.out.println(Size.SMALL.ml());
        System.out.println(Size.SMALL.bigger());
        System.out.println(Size.LARGE.bigger().ml());
    }
}
