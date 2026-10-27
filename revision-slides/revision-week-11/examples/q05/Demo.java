public class Demo {
    static void fill(java.util.List<Integer> xs) { xs.add(2); xs.add(3); }
    public static void main(String[] args) {
        java.util.List<Integer> a=new java.util.ArrayList<Integer>();
        java.util.List<Integer> b=new java.util.LinkedList<Integer>();
        fill(a); fill(b);
        System.out.println(a.equals(b));
        System.out.println(a.get(0));
    }
}
