public class Broken {
    public static void main(String[] args) {
        String[] input={"A,50","B,bad","C,101"};
        int total=0,passed=0,count=0;
        for(String line:input) {
            try {
                int mark=Integer.parseInt(line.split(",")[1]);
                if(mark<0 || mark>100) throw new IllegalArgumentException();
                count++;
                total+=mark;
                if(mark>=50) passed++;
            } catch(IllegalArgumentException e) {
                System.out.println("Invalid");
            }
        }
        System.out.println("count,total,passed");
        System.out.println(count+","+total+","+passed);
    }
}
