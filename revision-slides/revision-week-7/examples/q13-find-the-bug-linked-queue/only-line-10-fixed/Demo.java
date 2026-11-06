class Node {
    String value; Node next;
    Node(String v) { value = v; }
}
class LinkedQueue {
    private Node head, tail;
    void enqueue(String v) {
        Node n = new Node(v);
        if (tail == null) { head = n; tail = n; }
        else { tail.next = n; tail = n; }
    }
    String dequeue() {
        String v = head.value;
        head = head.next;
        return v;
    }
    int size() {
        int count = 0;
        for (Node n = head; n.next != null; n = n.next)
            count++;
        return count;
    }
}
public class Demo {
    public static void main(String[] args) {
        LinkedQueue q = new LinkedQueue();
        q.enqueue("An"); q.enqueue("Mai"); q.enqueue("Tuan");
        System.out.println(q.dequeue() + " " + q.size());
        System.out.println(q.dequeue() + " " + q.dequeue());
        q.enqueue("Linh");
        System.out.println(q.dequeue() + " " + q.size());
    }
}
