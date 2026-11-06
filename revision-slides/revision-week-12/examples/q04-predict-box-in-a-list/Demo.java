import java.util.ArrayList;

public class Demo {
    static void change(Box b, ArrayList<Box> list) {
        b.value = 7;
        b = new Box(9);
        list.add(b);
    }
    public static void main(String[] args) {
        Box x = new Box(1);
        ArrayList<Box> boxes = new ArrayList<>();
        boxes.add(x);
        change(x, boxes);
        System.out.println(x.value + " " + boxes.size());
        System.out.println(boxes.get(1).value);
        boxes.get(0).value++;
        System.out.println(x.value);
    }
}
class Box {
    int value;
    Box(int v) { value = v; }
}
