public class Demo {
    public static void main(String[] args) {
        String[] rows = {"Linh,85", "Mai,150", "Tuan,abc"};
        for (String r : rows) {
            try {
                Student s = parse(r);
                System.out.println(s.name + " " + s.mark);
            } catch (IllegalArgumentException e) {
                System.out.println("Invalid: " + r);
            }
        }
    }
    static Student parse(String row) {
        String[] parts = row.split(",");
        int mark = Integer.parseInt(parts[1]);
        if (mark < 0 || mark > 100)
            throw new IllegalArgumentException("range");
        return new Student(parts[0], mark);
    }
}
class Student {
    final String name;
    final int mark;
    Student(String name, int mark) {
        this.name = name;
        this.mark = mark;
    }
}
