public class Demo {
    public static void main(String[] args) {
        Book book=new Book("Tea");
        Shelf a=new Shelf(book);
        Shelf b=a;
        Shelf c=new Shelf(new Book("Coffee"));
        b.book.title="Water";
        System.out.println(a.book.title+" "+c.book.title);
        System.out.println(a==b);
    }
}
class Book { String title; Book(String t) { title=t; } }
class Shelf { Book book; Shelf(Book b) { book=b; } }
