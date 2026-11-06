import java.util.ArrayList;

public class Demo {
    public static void main(String[] args) {
        Shelf s = new Shelf();
        for (int i = 0; i < 4; i++)
            System.out.print(s.add(new Book("B" + i)) + " ");
        System.out.println();
        ListShelf t = new ListShelf();
        for (int i = 0; i < 40; i++) t.add(new Book("B" + i));
        System.out.println(t.size());
    }
}
class Book {
    String title;
    Book(String title) { this.title = title; }
}
class Shelf {
    private Book first, second, third;
    boolean add(Book b) {
        if (first == null) first = b;
        else if (second == null) second = b;
        else if (third == null) third = b;
        else return false;
        return true;
    }
}
class ListShelf {
    private final ArrayList<Book> books
        = new ArrayList<>();
    boolean add(Book b) {
        books.add(b);
        return true;
    }
    int size() { return books.size(); }
}
