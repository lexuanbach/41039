import java.util.Scanner;

public class Ticket {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Age: ");
        int age = input.nextInt();

        if (age < 0 || age > 120) {         // && here is never true -- a silent logic bug
            System.out.println("Invalid age");
        }
        else if (age < 18) {                // checked first, -1 would print "Child: $8"
            System.out.println("Child: $8");
        }
        else if (age >= 65) {               // > 65 charges a 65-year-old the adult price
            System.out.println("Senior: $10");
        }
        else {
            System.out.println("Adult: $15");
        }
    }
}
