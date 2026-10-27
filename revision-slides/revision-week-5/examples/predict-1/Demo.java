public class Demo {
    public static void main(String[] args) {
        Box a=new Box(2);
        Box b=a;
        b.side=3;
        System.out.println(a.volume());
        b=new Box(4);
        System.out.println(a.volume()+" "+b.volume());
    }
}
class Box {
    int side;
    Box(int side) { this.side=side; }
    int volume() { return side*side*side; }
}
