public class Demo {
    public static void main(String[] args) {
        Box<Integer> b = new Box<Integer>(5);
        b.set("7");                           // C
        System.out.println(b.get());
    }
}
class Box<T> {
    private T value;
    Box(T value) { this.value = value; }
    T get() { return value; }
    void set(T value) { this.value = value; }
}
