class Book:
    def __init__(self, title):
        self.title = title

class Shelf:
    def __init__(self, book):
        self.book = book
    def __str__(self):
        return "Shelf with " + self.book.title

b = Book("Dune")
s1 = Shelf(b)
s2 = Shelf(Book(b.title))
s2.book.title = "Emma"
s3 = Shelf(Book("Dune"))
print(s1)
print(s3)
print(s1.book is s2.book, s1.book is s3.book)
