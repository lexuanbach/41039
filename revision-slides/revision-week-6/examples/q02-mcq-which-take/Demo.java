public class Demo {
    public static void main(String[] args) {
        A a = new A();
        B b = new B();
        C c = new C();
        // take(9), stock, then take(-5), stock
        System.out.println(a.take(9) + " " + a.stock + " " + a.take(-5) + " " + a.stock);
        System.out.println(b.take(9) + " " + b.stock + " " + b.take(-5) + " " + b.stock);
        System.out.println(c.take(9) + " " + c.stock + " " + c.take(-5) + " " + c.stock);
    }
}
class A {
    int stock = 4;
    boolean take(int n) {
        if (n <= 0 || n > stock)
            return false;
        stock -= n;
        return true;
    }
}
class B {
    int stock = 4;
    boolean take(int n) {
        stock -= n;
        if (stock < 0)
            return false;
        return true;
    }
}
class C {
    int stock = 4;
    boolean take(int n) {
        if (n > stock)
            return false;
        stock -= n;
        return true;
    }
}
