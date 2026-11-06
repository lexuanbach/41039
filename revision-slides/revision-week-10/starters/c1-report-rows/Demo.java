public class Demo {
    public static void main(String[] args) {
        System.out.println(Rows.row("An", 50));
        System.out.println(Rows.row("Binh", 49));
        int[] m = {50, 49, 90};
        System.out.println(Rows.summary(m));
        System.out.println(Rows.summary(new int[0]));
    }
}
class Rows {
    // "An,50,pass" or "Binh,49,fail"
    static String row(String name, int mark) {
        return "";  // TODO
    }
    // "2/3 passed", or "no marks" if empty
    static String summary(int[] marks) {
        return "";  // TODO
    }
}
