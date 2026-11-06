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
    static String row(String name, int mark) {
        String result = "fail";
        if (mark >= 50) result = "pass";
        return name + "," + mark + "," + result;
    }
    static String summary(int[] marks) {
        if (marks.length == 0) return "no marks";
        int passed = 0;
        for (int m : marks) if (m >= 50) passed++;
        return passed + "/" + marks.length + " passed";
    }
}
