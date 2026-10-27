public class Demo {
    public static void main(String[] args) {
        Parent x=new Child();
        System.out.println(x.label+" "+x.name());
        Parent y=x;
        System.out.println(y.name());
    }
}
class Parent {
    String label="parent";
    String name() { return "P"; }
}
class Child extends Parent {
    String label="child";
    @Override String name() { return "C"; }
}
