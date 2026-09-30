import java.util.Scanner;

// Bug hunt: prints every prime below n, then how many there are.
// Five bugs. The compiler finds one of them.
public class Primes {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();

        next:
        for (int i = 1; i <= n; i++) {
            int count = 0;
            for (int j = 2; j < i; i++) {
                if (i % j == 0) break;
            }
            count++;
            System.out.println(i + " is prime.");
        }
        System.out.println(count + " primes below " + n);
    }
}
