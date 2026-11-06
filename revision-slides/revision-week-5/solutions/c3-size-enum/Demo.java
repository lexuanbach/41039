public class Demo {
    enum Size {
        SMALL(250), MEDIUM(350), LARGE(500);
        private final int ml;
        Size(int ml) { this.ml = ml; }
        int ml() { return ml; }
        Size bigger() {
            if (this == LARGE) return LARGE;
            return values()[ordinal() + 1];
        }
    }

    public static void main(String[] args) {
        System.out.println(Size.SMALL.ml());
        System.out.println(Size.SMALL.bigger());
        System.out.println(Size.LARGE.bigger().ml());
    }
}
