public class Cards {
    enum Suit {
        HEARTS, SPADES, DIAMONDS, CLUBS;
        String colour() {
            if (this == HEARTS
                    || this == DIAMONDS)
                return "red";
            return "black";
        }
    }
    static String colour(Suit s) { return s.colour(); }
    public static void main(String[] args) {
        System.out.println(colour(7));
    }
}
