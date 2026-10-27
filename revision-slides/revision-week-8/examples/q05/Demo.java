public class Demo {
    public static void main(String[] args) {
        Shape[] shapes = {new Square(3), new Rectangle(2,4)};
        for(Shape shape:shapes) System.out.println(shape.area());
    }
}
interface Shape { int area(); }
class Square implements Shape {
    private final int side;
    Square(int side) { this.side=side; }
    public int area() { return side*side; }
}
class Rectangle implements Shape {
    private final int w,h;
    Rectangle(int w,int h) { this.w=w; this.h=h; }
    public int area() { return w*h; }
}
