public class Demo {
    public static void main(String[] args) {
        Node head = new Node(1, new Node(2, new Node(3, null)));
        head = new Node(0, head);
        head.next.next = head.next.next.next;
        Node p = head.next;
        p.value = 5;
        p = p.next;
        p = new Node(7, null);
        String s = "";
        for (Node n = head; n != null; n = n.next)
            s += n.value + " ";
        System.out.println(s);
        System.out.println(p.value + " " + head.next.next.value);
    }
}
class Node {
    int value; Node next;
    Node(int v, Node n) { value = v; next = n; }
}
