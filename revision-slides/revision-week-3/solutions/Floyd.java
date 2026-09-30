import java.util.Scanner;

public class Floyd {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Rows: ");
        int rows = input.nextInt();
        System.out.print("Limit: ");
        int limit = input.nextInt();

        int k = 1;                          // declared inside the outer loop, every row restarts at 1
        done:
        for (int r = 1; r <= rows; r++) {
            for (int c = 1; c <= r; c++) {  // the inner bound uses the OUTER variable
                if (k > limit) break done;  // a plain break ends only this row -- the next
                System.out.print(k + " ");  //   rows then print as empty lines
                k++;
            }
            System.out.println();
        }
    }
}
