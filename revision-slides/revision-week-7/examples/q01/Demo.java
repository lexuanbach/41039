import java.util.ArrayList;

public class Demo {
    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<String>();
        names.add("An");
        names.add("Mai");
        names.add(1,"Linh");
        names.set(0,"Binh");
        System.out.println(names);
        System.out.println(names.size());
    }
}
