public class Demo {
    public static void main(String[] args) {
        Animal a=new Dog();
        Animal b=a;
        Animal c=new Cat();
        System.out.println(a.speak()+" "+b.speak()+" "+c.speak());
        System.out.println(a==b);
    }
}
class Animal { String speak() { return "animal"; } }
class Dog extends Animal { String speak() { return "woof"; } }
class Cat extends Animal { String speak() { return "meow"; } }
