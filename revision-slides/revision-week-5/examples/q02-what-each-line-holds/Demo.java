public class Demo {
    public static void main(String[] args) {
        Lamp a = new Lamp("hall");
        Lamp b = new Lamp("desk");
        Lamp c = a;
        a.toggle();
        c.toggle();
        b.toggle();
        System.out.println(a.on);                      // (a)
        System.out.println(b.on);                      // (b)
        System.out.println(Lamp.made);                 // (c)
        System.out.println(c.room);                    // (d)
        System.out.println((a == c) + " " + (a == b)); // (e)
    }
}
class Lamp {
    static int made = 0;
    boolean on;
    String room;
    Lamp(String room) {
        this.room = room;
        made++;
    }
    void toggle() { on = !on; }
}
