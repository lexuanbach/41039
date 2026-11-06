public class Demo {
    public static void main(String[] args) {
        Rectangle a = new Rectangle(3, 4);
        Rectangle b = new Rectangle(5, 5);
        System.out.println(a.area() + " " + b.area());
        System.out.println(Rectangle.count);
    }
}
class Rectangle {
    static int count = 0;
    private int width;
    private int height;
    Rectangle(int width, int height) {
        this.width = width;
        this.height = height;
        count++;
    }
    int area() {
        return width * height;
    }
}
