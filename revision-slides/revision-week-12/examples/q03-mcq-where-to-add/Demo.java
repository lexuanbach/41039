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
                    marks.add(mark); // (2): option B
                } else {
                    System.out.println("Out of range");
                }
            } catch (NumberFormatException e) {
                System.out.println("Not a number");
                // (3)
            }
        }
        System.out.println(marks);
    }
}
