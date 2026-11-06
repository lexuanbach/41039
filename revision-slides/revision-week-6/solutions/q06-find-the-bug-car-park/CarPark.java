public class CarPark {
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
