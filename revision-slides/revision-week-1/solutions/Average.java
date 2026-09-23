import java.util.Scanner;

public class Average {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("First number: ");
        int a = input.nextInt();

        System.out.print("Second number: ");
        int b = input.nextInt();

        int sum = a + b;

        double average = sum / 2.0;     // or: (double) sum / 2
        // sum / 2 is int / int, so 9 / 2 gives 4 -- the Week 1 trap

        System.out.println("Sum: " + sum);
        System.out.println("Average: " + average);
    }
}
