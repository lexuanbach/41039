import java.util.*;

public class Demo {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int n=Integer.parseInt(sc.nextLine());
        List<Student> records=new ArrayList<Student>();
        for(int i=0;i<n;i++) {
            String line=sc.nextLine();
            String[] parts=line.split(",",-1);
            try {
                if(parts.length!=2 || parts[0].isEmpty()) throw new IllegalArgumentException();
                int mark=Integer.parseInt(parts[1]);
                if(mark<0 || mark>100) throw new IllegalArgumentException();
                records.add(new Student(parts[0],mark));
            } catch(IllegalArgumentException e) { System.out.println("Invalid"); }
        }
        int total=0,passed=0;
        for(Student student:records) { total+=student.mark(); if(student.passed()) passed++; }
        System.out.println("count,total,passed");
        System.out.println(records.size()+","+total+","+passed);
    }
}
class Student {
    private final String name;
    private final int mark;
    Student(String name,int mark) { this.name=name; this.mark=mark; }
    int mark() { return mark; }
    boolean passed() { return mark>=50; }
}
