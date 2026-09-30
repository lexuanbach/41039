public class Stats {
    record Summary(int min, int max, double mean) {}

    static Summary summarise(int[] values) {
        int min = values[0];            // not 0: for {-3, -7}, max would stay 0
        int max = values[0];
        int total = 0;
        for (int v : values) {
            if (v < min) min = v;
            if (v > max) max = v;
            total += v;
        }
        return new Summary(min, max, (double) total / values.length);   // int / int gives 70.0
    }

    public static void main(String[] args) {
        System.out.println(summarise(new int[] {72, 55, 91, 64}));
        System.out.println(summarise(new int[] {5}));
        System.out.println(summarise(new int[] {-3, -7}));
    }
}
