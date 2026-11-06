public class Demo {
    public static void main(String[] args) {
        Greeter[] gs = { new English(), new Vietnamese(),
            new Loud(new English()),
            new Loud(new Vietnamese()) };
        for (Greeter g : gs)
            System.out.println(g.greet("Lan"));
    }
}
interface Greeter { String greet(String name); }
class English implements Greeter {
    public String greet(String name) {
        return "Hello, " + name;
    }
}
class Vietnamese implements Greeter {
    public String greet(String name) {
        return "";  // TODO
    }
}
class Loud implements Greeter {
    private final Greeter inner;
    Loud(Greeter inner) { this.inner = inner; }
    public String greet(String name) {
        return "";  // TODO
    }
}
