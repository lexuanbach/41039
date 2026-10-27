public class Broken {
    public static void main(String[] args) {
        String[] input={"12","bad","7"};
        int total=0,count=0;
        for(String text:input) {
            try {
                int value=Integer.parseInt(text);
                total+=value;
                count++;
            } catch(NumberFormatException e) {
                System.out.println("Invalid");
            }
        }
        System.out.println(count+" "+total);
    }
}
