public class Demo {
    // The slide's version (buggy: > instead of >=)
    static int countPassed(int[] marks) {
        int count = 0;
        for (int i = 0; i < marks.length; i++)
            if (marks[i] > 50) count++;
        return count;
    }
    // What the rule asks for
    static int rightCount(int[] marks) {
        int count = 0;
        for (int m : marks)
            if (m >= 50) count++;
        return count;
    }
    public static void main(String[] args) {
        int[][] tests = { {}, {49, 85}, {50, 70}, {0, 100} };
        String[] names = { "A", "B", "C", "D" };
        for (int t = 0; t < tests.length; t++) {
            int got = countPassed(tests[t]);
            int want = rightCount(tests[t]);
            System.out.println(names[t] + ": expected " + want + ", got " + got
                + (got == want ? " (passes)" : " (FAILS)"));
        }
    }
}
