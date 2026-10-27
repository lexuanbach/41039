import java.util.*;

public class Demo {
    public static void main(String[] args) {
        List<Integer> marks=Arrays.asList(49,50,85);
        int total=marks.stream()
            .filter(mark -> mark>=50)
            .mapToInt(mark -> mark)
            .sum();
        System.out.println(total);
        System.out.println(marks);
    }
}
