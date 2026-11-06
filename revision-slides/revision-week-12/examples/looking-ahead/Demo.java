import java.util.*;
import java.util.stream.Collectors;

public class Demo {
    public static void main(String[] args) {
        List<Integer> marks = Arrays.asList(49, 50, 120, 85, -3);
        // Core: a loop that builds a new list (Q10)
        List<Integer> loop = new ArrayList<>();
        for (int m : marks)
            if (m >= 50 && m <= 100) loop.add(m);
        System.out.println(loop);
        // Optional enrichment: the same filter as a Java 8 stream
        List<Integer> pass = marks.stream()
            .filter(m -> m >= 50 && m <= 100)
            .collect(Collectors.toList());
        System.out.println(pass);
        System.out.println(marks);
    }
}
