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
    static int parseMark(String text) {
        String t = text.trim();
        int m;
        try {
            m = Integer.parseInt(t);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException(
                "not a number: " + t);
        }
        if (m < 0 || m > 100) throw new
            IllegalArgumentException("out of range: " + m);
        return m;
    }
}
