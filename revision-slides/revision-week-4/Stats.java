public class Stats {
    // TODO 1: a record Summary holding the min and max (ints) and the mean (a double)


    // TODO 2: static Summary summarise(int[] values)
    //         One pass over the array. No sorting. values has at least one element.


    public static void main(String[] args) {
        System.out.println(summarise(new int[] {72, 55, 91, 64}));
        System.out.println(summarise(new int[] {5}));
        System.out.println(summarise(new int[] {-3, -7}));
    }
}
