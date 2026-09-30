import java.util.Scanner;

// The five logic errors, fixed (line numbers as on the slide):
//   L4  sum declared inside the outer loop -- outside, it is never reset between rows
//   L5  i <= n, not i < n                 -- the last row was missing
//   L6  j <= i, not j < i                 -- each row missed i itself
//   L8  break rows, not break             -- a plain break ends only the inner loop, so the
//                                            row is still printed and the next row starts
//   L11 total += sum, not total = sum     -- = keeps only the last row
public class RowSums {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int limit = sc.nextInt();

        int total = 0;
        rows:
        for (int i = 1; i <= n; i++) {
            int sum = 0;
            for (int j = 1; j <= i; j++) {
                sum += j;
                if (sum > limit) break rows;
            }
            System.out.println(i + ": " + sum);
            total += sum;
        }
        System.out.println("Total: " + total);
    }
}
