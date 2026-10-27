public class Demo {
record Student(String name, int mark) {}

static String grade(Object o) {
    return switch (o) {
        case Student s when s.mark() >= 50 -> "P";
        case Student s when s.mark() >= 85 -> "HD";
        case Student s -> "Z";
        default -> "not a student";
    };
}
 public static void main(String[] args) { System.out.println(grade(new Student("An",92))); }
}
