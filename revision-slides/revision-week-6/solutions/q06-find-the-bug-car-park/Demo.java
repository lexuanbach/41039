public class Demo {
    public static void main(String[] args) {
        CarPark a = new CarPark(2);
        CarPark b = new CarPark(5);
        System.out.println(a.park() + " "
            + a.park() + " " + a.park());
        System.out.println(b.free());
        System.out.println(b.leave() + " "
            + b.leave() + " " + b.free());
    }
}
class CarPark {
    private int capacity;
    private int parked;
    public CarPark(int cap) { capacity = cap; }
    public boolean park() {
        if (parked >= capacity) return false;
        parked++;
        return true;
    }
    public boolean leave() {
        if (parked == 0) return false;
        parked--;
        return true;
    }
    public int free() {
        return capacity - parked;
    }
}
