public class Demo {
    public static void main(String[] args) {
        Parent value = new Child();
        System.out.println(value.label);
        System.out.println(value.describe());
    }
}
class Parent {
    String label="parent field";
    String describe() { return "parent method"; }
}
class Child extends Parent {
    String label="child field";
    @Override String describe() { return "child method"; }
}
