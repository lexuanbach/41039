public class Demo {
    public static void main(String[] args) {
        String[] values={"12","bad","7"};
        for(String text:values) {
            try { System.out.println(Integer.parseInt(text)+1); }
            catch(NumberFormatException e) { System.out.println("Invalid: "+text); }
        }
    }
}
