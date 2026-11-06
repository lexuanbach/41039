public class Demo {
    public static void main(String[] args) {
        String[] lines = {"3", "two", "5"};
        int axles = 0;
        for (String s : lines)
            axles += Integer.parseInt(s);
        System.out.println(axles);
    }
}
