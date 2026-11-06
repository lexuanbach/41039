public class Demo {
    public static void main(String[] args) {
        Pet p = new Cat("Tom");
        Speaker s = p;               // A
        String t = p.speak();        // B
        new Cat("Mo").purr();        // D
        System.out.println(s.speak() + " / " + t);
    }
}
interface Speaker { String speak(); }
abstract class Pet implements Speaker {
    protected final String name;
    Pet(String name) { this.name = name; }
}
class Cat extends Pet {
    Cat(String name) { super(name); }
    public String speak() { return name + ": meow"; }
    void purr() { System.out.println("purr"); }
}
