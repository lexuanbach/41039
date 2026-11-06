import java.util.ArrayList;

public class Demo {
    public static void main(String[] args) {
        String[] rows = {"Linh,85", "An,abc", "Mai,50",
                         "Tuan,120"};
        ArrayList<Integer> marks = new ArrayList<>();
        for (String row : rows) {
            String[] parts = row.split(",");
            try {
                int mark = Integer.parseInt(parts[1]);
                // (1)
                if (mark >= 0 && mark <= 100) {
                    // (2)
                } else {
                    System.out.println("Out of range");
                    marks.add(mark); // option D: in the else branch
                }
            } catch (NumberFormatException e) {
                System.out.println("Not a number");
                // (3)
            }
        }
        System.out.println(marks);
    }
}
