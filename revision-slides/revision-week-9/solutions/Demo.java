import java.util.Scanner;

public class Demo {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int n=Integer.parseInt(sc.nextLine());
        int total=0;
        for(int i=0;i<n;i++) {
            try { total+=Integer.parseInt(sc.nextLine()); }
            catch(NumberFormatException e) { System.out.println("Invalid"); }
        }
        System.out.println("Total: "+total);
    }
}
