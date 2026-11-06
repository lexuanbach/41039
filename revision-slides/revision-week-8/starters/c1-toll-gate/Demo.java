public class Demo {
    public static void main(String[] args) {
        Vehicle[] queue = { new Car("CAR-1"),
            new Truck("TRK-2", 2), new Truck("TRK-7", 3) };
        int total = 0;
        for (Vehicle v : queue) {
            System.out.println(v);
            total += v.toll();
        }
        System.out.println("Total " + total);
    }
}
abstract class Vehicle {
    private final String plate;
    Vehicle(String plate) { this.plate = plate; }
    abstract int toll();
    public String toString() {
        return plate + " pays " + toll();
    }
}
class Car extends Vehicle {
    Car(String plate) { super(plate); }
    int toll() { return 5; }
}
class Truck extends Vehicle {
    Truck(String plate, int axles) {
        super("?");  // TODO
    }
    int toll() { return 0; }  // TODO
}
