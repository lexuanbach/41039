public class Demo {
    public static void main(String[] args) {
        Pizza p = new Pizza("large", 8);
        System.out.println(p.describe());
    }
}
class Pizza {
    String size;
    int slices;
    Pizza(String size, int slices) {
        size = size;
        this.slices = slices;
    }
    String describe() {
        return size + " pizza, "
               + slices + " slices";
    }
}
