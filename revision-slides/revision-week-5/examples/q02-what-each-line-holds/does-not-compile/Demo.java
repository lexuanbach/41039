public class Demo {
    public static void main(String[] args) {
        Lamp a = new Lamp("hall");
        Lamp b = new Lamp("desk");
        Lamp c = a;
        a.toggle();
        c.toggle();
        b.toggle();
        Lamp.toggle();                                 // (f)
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
