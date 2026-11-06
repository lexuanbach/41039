public class Cards {
    static final int HEARTS = 0, SPADES = 1,
                     DIAMONDS = 2, CLUBS = 3;
    static String colour(int suit) {
        if (suit == HEARTS || suit == DIAMONDS)
            return "red";
        return "black";
    }
    public static void main(String[] args) {
        System.out.println(colour(DIAMONDS));
        System.out.println(colour(7));
    }
}
