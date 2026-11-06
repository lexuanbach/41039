public class Demo {
    public static void main(String[] args) {
        String[] inputs = {" 85", "abc", "120", "0"};
        for (String s : inputs) {
            try {
                System.out.println(Marks.parseMark(s));
            } catch (IllegalArgumentException e) {
                System.out.println(e.getMessage());
            }
        }
    }
}
class Marks {
    // " 85" gives 85
    static int parseMark(String text) {
        // TODO
        return 0;
    }
}
