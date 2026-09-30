public class Marks {
    static average(int[] values) {
        int total = 0;
        for (int v : values) total += v;
        return total / values.length;
    }
    static void highest(int[] values) {
        int max = 0;
        for (int v : values) if (v > max) max = v;
        return max;
    }
    static void clear(int[] values) {
        values = new int[values.length];
    }
    public static void main(String[] args) {
        int[] marks = {72, 55, 91, 64};
        System.out.println(average(marks)
            + " " + highest(marks));
        clear(marks);
        System.out.println(marks[0]);
        System.out.println(total);
    }
}
