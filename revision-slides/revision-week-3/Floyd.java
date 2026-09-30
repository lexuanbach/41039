import java.util.Scanner;

public class Floyd {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Rows: ");
        int rows = input.nextInt();
        System.out.print("Limit: ");
        int limit = input.nextInt();

        // TODO 1: Floyd's triangle -- row 1 has one number, row 2 has two, ...
        //         and the numbers keep counting up: 1 / 2 3 / 4 5 6 / ...
        //         Which variable must live OUTSIDE both loops?


        // TODO 2: stop EVERYTHING the moment the next number would be over limit.
        //         Not just this row -- the whole triangle.

    }
}
