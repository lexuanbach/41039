public class Demo {
    public static void main(String[] args) {
        Tally x = new Tally();
        Tally y = new Tally();
        for (int i = 1; i <= 4; i++) {
            if (i % 2 == 1) x.add(i);
            else y.add(i);
            if (i == 2) y = x;
        }
        System.out.println(x.mine + " " + y.mine
                           + " " + Tally.total);
    }
}
class Tally {
    static int total = 0;
    int mine = 0;
    void add(int n) { mine += n; total += n; }
}
