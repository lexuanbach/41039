public class Demo {
    public static void main(String[] args) {
        Vehicle[] vs = { new Bike(), new Vehicle(4) };
        for (Vehicle v : vs) System.out.println(v.info());
    }
}
class Vehicle {
    protected int wheels;
    Vehicle(int wheels) {
        this.wheels = wheels;
        System.out.println("Vehicle " + wheels);
    }
    String info() { return wheels + " wheels"; }
}
class Bike extends Vehicle {
    Bike() {
        // super(2);  (deleted)
        System.out.println("Bike");
    }
    @Override String info() {
        return "Bike, " + super.info();
    }
}
