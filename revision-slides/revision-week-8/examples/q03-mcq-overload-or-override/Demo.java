public class Demo {
    public static void main(String[] args) {
        Animal pet = new Dog();
        System.out.println(Vet.check(pet));
    }
}
class Animal {
    String sound() { return "..."; }
}
class Dog extends Animal {
    @Override String sound() { return "woof"; }
}
class Vet {
    static String check(Animal a) {
        return "animal " + a.sound();
    }
    static String check(Dog d) {
        return "dog " + d.sound();
    }
}
