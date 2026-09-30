import java.util.Scanner;

// The five bugs, fixed:
//   1. i starts at 2, not 1      -- 1 is not prime, and the inner loop never runs for it
//   2. i < n, not i <= n         -- "below n"
//   3. count declared OUTSIDE    -- inside, it is back to 0 every pass and does not
//                                   exist after the loop (the one the compiler catches)
//   4. j++, not i++              -- the inner loop must change ITS OWN variable
//   5. continue next, not break  -- break only leaves the inner loop, so count++ and
//                                   the println still run for every non-prime
public class Primes {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();

        int count = 0;
        next:
        for (int i = 2; i < n; i++) {
            for (int j = 2; j < i; j++) {
                if (i % j == 0) continue next;
            }
            count++;
            System.out.println(i + " is prime.");
        }
        System.out.println(count + " primes below " + n);
    }
}
