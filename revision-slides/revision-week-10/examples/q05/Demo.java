public class Demo {
    static String format(String name,int mark) { return name+","+mark; }
    public static void main(String[] args) {
        String[] names={"Linh","An"};
        int[] marks={85,49};
        for(int i=0;i<names.length;i++) System.out.println(format(names[i],marks[i]));
    }
}
