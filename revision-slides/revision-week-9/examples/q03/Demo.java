public class Demo {
    static void parse() { Integer.parseInt("x"); }
    public static void main(String[] args) {
        try {
            parse();
            System.out.println("after parse");
        } catch(NumberFormatException e) {
            System.out.println("caught");
        } finally {
            System.out.println("cleanup");
        }
        System.out.println("done");
    }
}
