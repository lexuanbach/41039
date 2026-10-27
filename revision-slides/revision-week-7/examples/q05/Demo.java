public class Demo {
    public static void main(String[] args) {
        Box<String> label = new Box<String>("tea");
        Box<Integer> count = new Box<Integer>(3);
        System.out.println(label.get() + " " + count.get());
    }
}
class Box<T> {
    private final T value;
    Box(T value) { this.value = value; }
    T get() { return value; }
}
