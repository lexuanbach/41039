public class Demo {
    public static void main(String[] args) {
        int total=0;
        for(String text:new String[]{"12","bad","7"}) {
            try { total+=Integer.parseInt(text); }
            catch(NumberFormatException e) { System.out.println("Invalid"); }
        }
        System.out.println(total);
    }
}
