import java.util.*;

public class Demo {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        int n=sc.nextInt();
        List<Integer> result=new ArrayList<Integer>();
        for(int i=0;i<n;i++) {
            int x=sc.nextInt();
            if(!result.contains(x)) result.add(x);
        }
        for(int i=0;i<result.size();i++) {
            if(i>0) System.out.print(" ");
            System.out.print(result.get(i));
        }
        System.out.println();
    }
}
