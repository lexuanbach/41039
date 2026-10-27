public class Demo {
    public static void main(String[] args) {
        int n = 7;
        String s = switch (n % 3) {
            case 0 -> "fizz";
            case 1 -> "one";
            default -> "other";
        };
        System.out.println(s);
    }
}
