public class CarPark {
    private int capacity;
    private static int parked;
    public CarPark(int cap) { capacity = cap; }
    public boolean park() {
        if (parked > capacity) return false;
        parked++;
        return true;
    }
    public boolean leave() {
        parked--;
        return true;
    }
    public static int free() {
        return capacity - parked;
    }
}
