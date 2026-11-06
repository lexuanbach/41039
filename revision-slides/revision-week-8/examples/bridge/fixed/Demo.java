public class Demo {
    public static void main(String[] args) {
        String[] lines = {"3", "two", "5"};
        int axles = 0;
        for (String s : lines) {
            try {
                axles += Integer.parseInt(s);
            } catch (NumberFormatException e) {
                System.out.println("skip " + s);
            }
        }
        System.out.println(axles);
    }
}
