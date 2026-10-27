import java.util.Scanner;

public class Demo {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        String kind=sc.next();
        Shape shape;
        if(kind.equals("S")) shape=new Square(sc.nextInt());
        else shape=new Rectangle(sc.nextInt(),sc.nextInt());
        System.out.println(shape.area());
    }
}
interface Shape { int area(); }
class Square implements Shape {
    private final int s;
    Square(int s) { this.s=s; }
    public int area() { return s*s; }
}
class Rectangle implements Shape {
    private final int w,h;
    Rectangle(int w,int h) { this.w=w; this.h=h; }
    public int area() { return w*h; }
}
