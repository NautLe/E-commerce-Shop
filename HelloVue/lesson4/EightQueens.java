public class EightQueens {
    static final int SIZE = 8;
    static int solutionCount = 0;

    public static void main(String[] args) {
        int[] board = new int[SIZE]; // board[i] = column of queen in row i
        solve(board, 0);
        System.out.println("Total solutions: " + solutionCount);
    }

    // Recursive backtracking solver
    public static void solve(int[] board, int row) {
        if (row == SIZE) {
            printBoard(board);
            solutionCount++;
            return;
        }

        for (int col = 0; col < SIZE; col++) {
            if (isSafe(board, row, col)) {
                board[row] = col;
                solve(board, row + 1);
            }
        }
    }

    // Check if placing a queen at (row, col) is safe
    public static boolean isSafe(int[] board, int row, int col) {
        for (int prevRow = 0; prevRow < row; prevRow++) {
            int prevCol = board[prevRow];

            // Same column or diagonal
            if (prevCol == col || Math.abs(prevCol - col) == Math.abs(prevRow - row)) {
                return false;
            }
        }
        return true;
    }

    // Print the board with queens placed
    public static void printBoard(int[] board) {
        System.out.println("Solution " + (solutionCount + 1) + ":");
        for (int row = 0; row < SIZE; row++) {
            for (int col = 0; col < SIZE; col++) {
                if (board[row] == col) {
                    System.out.print(" Q ");
                } else {
                    System.out.print(" . ");
                }
            }
            System.out.println();
        }
        System.out.println();
    }
}
