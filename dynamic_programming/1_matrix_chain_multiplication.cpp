#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Enter number of matrices: ";
    cin >> n;

    int p[20];
    cout << "Enter dimensions (p[0] to p[n]) - " << n + 1 << " values:" << endl;
    for (int i = 0; i <= n; i++) {
        cin >> p[i];
    }

    int dp[20][20] = {0};  // dp[i][j] = min cost to multiply matrices i..j
    int split[20][20] = {0}; // to reconstruct optimal split

    // chain length from 2 to n
    for (int len = 2; len <= n; len++) {
        for (int i = 1; i <= n - len + 1; i++) {
            int j = i + len - 1;
            dp[i][j] = 99999;
            for (int k = i; k < j; k++) {
                int cost = dp[i][k] + dp[k + 1][j] + p[i - 1] * p[k] * p[j];
                if (cost < dp[i][j]) {
                    dp[i][j] = cost;
                    split[i][j] = k;
                }
            }
        }
    }

    cout << "\nDP Table (minimum costs):" << endl;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            if (i > j)
                cout << "  -  ";
            else
                cout << dp[i][j] << "\t";
        }
        cout << endl;
    }

    cout << "\nMinimum number of multiplications: " << dp[1][n] << endl;

    return 0;
}
