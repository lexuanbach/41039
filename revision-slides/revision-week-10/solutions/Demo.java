import java.util.Scanner;

public class Demo {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int n=sc.nextInt(),total=0,passed=0;
        for(int i=0;i<n;i++) { int mark=sc.nextInt(); total+=mark; if(mark>=50) passed++; }
        System.out.println("count,total,passed");
        System.out.println(n+","+total+","+passed);
    }
}
