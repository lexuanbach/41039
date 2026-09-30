import java.util.Scanner;

// Spot the errors 3: for each row i from 1 to n, print 1 + 2 + ... + i. Stop EVERYTHING
// the moment a sum goes over limit. Then print the total of the rows printed.
// It compiles and it runs. Five logic errors.
public class RowSums {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int limit = sc.nextInt();

        int total = 0;
        int sum = 0;
        for (int i = 1; i < n; i++) {
            for (int j = 1; j < i; j++) {
                sum += j;
                if (sum > limit) break;
            }
            System.out.println(i + ": " + sum);
            total = sum;
        }
        System.out.println("Total: " + total);
    }
}
