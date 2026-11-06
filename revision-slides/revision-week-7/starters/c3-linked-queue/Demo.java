public class Demo {
    public static void main(String[] args) {
        IntQueue q = new IntQueue();
        q.enqueue(5); q.enqueue(6); q.enqueue(7);
        System.out.println(q.dequeue() + " " + q.size());
        System.out.println(q.dequeue() + " "
            + q.dequeue() + " " + q.size());
        q.enqueue(8);
        System.out.println(q.dequeue() + " " + q.size());
    }
}
class Node {
    int value; Node next;
    Node(int v) { value = v; }
}
class IntQueue {
    private Node head, tail;
    void enqueue(int v) {
        Node n = new Node(v);
        if (tail == null) head = n;
        else tail.next = n;
        tail = n;
    }
    int dequeue() { return 0; }  // TODO
    int size() { return 0; }     // TODO
}
