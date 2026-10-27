public class Cards {
    enum Suit { HEARTS, SPADES, DIAMONDS, CLUBS; }

    public static void main(String[] args) {
        Suit a = Suit.HEARTS;
        Suit b = Suit.values()[0];
        System.out.println(a + " " + (a == b));
    }
}
