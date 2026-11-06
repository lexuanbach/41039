import java.util.Scanner;
public class Demo {
    public static void main(String[] args) {
        try (Scanner in = new Scanner("10 x 20\n\ny 5")) {
            System.out.println(Tokens.sumInts(in));
        }
        System.out.println(Tokens.sumInts(new Scanner("")));
    }
}
class Tokens {
    static int sumInts(Scanner in) {
        int total = 0;
        while (in.hasNext()) {
            if (in.hasNextInt()) {
                total += in.nextInt();
            } else {
                System.out.println("skip " + in.next());
            }
        }
        return total;
    }
}
