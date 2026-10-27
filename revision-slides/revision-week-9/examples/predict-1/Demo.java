public class Demo {
    public static void main(String[] args) {
        try {
            System.out.println("A");
            Integer.parseInt("bad");
            System.out.println("B");
        } catch(NumberFormatException e) {
            System.out.println("C");
        } finally { System.out.println("D"); }
        System.out.println("E");
    }
}
