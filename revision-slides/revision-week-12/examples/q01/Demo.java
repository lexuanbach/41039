public class Demo {
    public static void main(String[] args) {
        int[] marks={49,50,85};
        int passed=0;
        for(int i=0;i<marks.length;i++) {
            if(marks[i]>=50) passed++;
        }
        System.out.println(passed);
    }
}
