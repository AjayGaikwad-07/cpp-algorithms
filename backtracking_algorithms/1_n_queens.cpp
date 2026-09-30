#include <iostream>
#include <vector>
#include <cmath>

using namespace std;

// Check if a queen can be safely placed on board[row][col]
bool isSafe(const vector<int>& board, int row, int col) {
    for (int prevRow = 0; prevRow < row; prevRow++) {
        int prevCol = board[prevRow];
        // Check same column or diagonal attack
        if (prevCol == col || abs(prevRow - row) == abs(prevCol - col)) {
            return false;
        }
    }
    return true;
}

void printBoard(const vector<int>& board, int n, int solutionNum) {
    cout << "\n--- Solution #" << solutionNum << " ---" << endl;
    for (int r = 0; r < n; r++) {
        for (int c = 0; c < n; c++) {
            if (board[r] == c) {
                cout << " Q ";
            } else {
                cout << " . ";
            }
        }
        cout << "  (Row " << r << " -> Col " << board[r] << ")\n";
    }
}

void solveNQueens(int row, int n, vector<int>& board, int& totalSolutions, int& stateCount) {
    stateCount++;
    if (row == n) {
        totalSolutions++;
        printBoard(board, n, totalSolutions);
        return;
    }

    for (int col = 0; col < n; col++) {
        if (isSafe(board, row, col)) {
            board[row] = col; // Place queen
            solveNQueens(row + 1, n, board, totalSolutions, stateCount); // Recurse
            board[row] = -1;  // Backtrack
        }
    }
}

int main() {
    int n;
    cout << "Enter number of Queens (N): ";
    if (!(cin >> n) || n <= 0) {
        n = 4;
        cout << "Defaulting to N = 4" << endl;
    }

    cout << "========================================" << endl;
    cout << "   N-QUEENS PROBLEM USING BACKTRACKING  " << endl;
    cout << "========================================" << endl;

    vector<int> board(n, -1);
    int totalSolutions = 0;
    int stateCount = 0;

    solveNQueens(0, n, board, totalSolutions, stateCount);

    cout << "\n---------------- Result Summary ----------------" << endl;
    cout << "Board Dimensions: " << n << " x " << n << endl;
    cout << "State-Space Tree Nodes Explored: " << stateCount << endl;
    cout << "Total Valid Solutions Found: " << totalSolutions << endl;

    if (totalSolutions == 0) {
        cout << "No valid configuration exists for N = " << n << endl;
    }
    return 0;
}
