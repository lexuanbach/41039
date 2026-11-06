public class Demo {
    // Q4 part 2: one more catch in total(), so "too big" is skipped like "x"
    static int mark(String s) {
        int m = Integer.parseInt(s);
        if (m > 100)
            throw new IllegalArgumentException("too big");
        return m;
    }
    static int total(String[] marks) {
        int sum = 0;
        for (String s : marks) {
            try {
                sum += mark(s);
            } catch (NumberFormatException e) {
                System.out.println("skip " + s);
            } catch (IllegalArgumentException e) {
                System.out.println("skip " + s);
            } finally {
                System.out.println("checked " + s);
            }
        }
        return sum;
    }
    public static void main(String[] args) {
        String[] a = {"40", "x"};
        String[] b = {"120", "9"};
        try {
            System.out.println(total(a));
            System.out.println(total(b));
        } catch (IllegalArgumentException e) {
            System.out.println("main: " + e.getMessage());
        }
    }
}
