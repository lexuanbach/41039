import java.util.ArrayList;
import java.util.Arrays;

public class Demo {
    public static void main(String[] args) {
        ArrayList<Integer> values = new ArrayList<Integer>(Arrays.asList(4,1,4));
        values.remove(1);
        values.remove(Integer.valueOf(4));
        System.out.println(values);
    }
}
