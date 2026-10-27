public class Broken {
    public static void main(String[] args) {
        Animal pet=new Dog("Milo");
        System.out.println(pet.speak());
    }
}
class Animal {
    protected final String name;
    Animal(String name) { this.name=name; }
    String speak() { return "Animal "+name; }
}
class Dog extends Animal {
    Dog(String name) { super(name); }
    @Override String speak() { return "Dog "+name; }
}
