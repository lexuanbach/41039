public class Demo {
    public static void main(String[] args) {
        Box<Integer> b = new Box<Integer>(5);
        int n = b.get() + 1;                  // A
        b.set(7);                             // B
        Integer m = b.get();                  // D
        System.out.println(n + " " + b.get() + " " + m);
    }
}
class Box<T> {
    private T value;
    Box(T value) { this.value = value; }
    T get() { return value; }
    void set(T value) { this.value = value; }
}
