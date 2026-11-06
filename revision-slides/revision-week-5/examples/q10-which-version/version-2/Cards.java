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
    public static void main(String[] args) {
        System.out.println(Suit.DIAMONDS.colour());
    }
}
