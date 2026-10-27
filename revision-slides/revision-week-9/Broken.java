public class Broken {
    public static void main(String[] args) {
        String[] input={"12","bad","7"};
        int total=0,count=0;
        try {
            for(String text:input) {
                count++;
                total+=Integer.parseInt(text);
            }
        } catch(NumberFormatException e) {
            System.out.println("Invalid");
        }
        System.out.println(count+" "+total);
    }
}
