import java.util.*;
public class Broken {
    public static void main(String[] args) {
        ArrayList<Integer> xs=new ArrayList<Integer>(Arrays.asList(9,1,9,2));
        int target=1;
        xs.remove(target);
        for(int i=0;i<xs.size();i++) {
            if(xs.get(i)==9) xs.remove(i);
        }
        System.out.println(xs);
    }
}
