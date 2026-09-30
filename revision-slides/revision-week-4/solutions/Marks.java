// The five bugs, fixed:
//   (line numbers as on the slide and in ../Marks.java)
//   L2  average had no return type          -- javac stops here: "return type required"
//   L5  total / values.length is int / int  -- 70, not 70.5: cast one side to double
//   L7  highest is void but returns max     -- "unexpected return value" (and main's use of it
//                                             gives a second message: "'void' type not allowed here")
//   L13 clear reassigned its parameter      -- the caller's array is untouched: change the
//                                             elements instead
//   L21 total does not exist in main        -- it lived in average's frame: "cannot find symbol"
// A sixth, for the keen: max = 0 is only safe because marks are never negative.
public class Marks {
    static double average(int[] values) {
        int total = 0;
        for (int v : values) total += v;
        return (double) total / values.length;
    }

    static int highest(int[] values) {
        int max = values[0];
        for (int v : values) if (v > max) max = v;
        return max;
    }

    static void clear(int[] values) {
        for (int i = 0; i < values.length; i++) values[i] = 0;
    }

    public static void main(String[] args) {
        int[] marks = {72, 55, 91, 64};
        System.out.println(average(marks) + " " + highest(marks));
        clear(marks);
        System.out.println(marks[0]);
    }
}
