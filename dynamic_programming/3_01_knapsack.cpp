#include <iostream>
using namespace std;

int main() {
    int n, capacity;
    cout << "Enter number of items: ";
    cin >> n;

    int val[100], wt[100];
    cout << "Enter value and weight of each item:" << endl;
    for (int i = 0; i < n; i++) {
        cin >> val[i] >> wt[i];
    }

    cout << "Enter knapsack capacity: ";
    cin >> capacity;

    int dp[100][100] = {0};

    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            dp[i][w] = dp[i - 1][w];
            if (wt[i - 1] <= w) {
                int include = dp[i - 1][w - wt[i - 1]] + val[i - 1];
                if (include > dp[i][w])
                    dp[i][w] = include;
            }
        }
    }

    cout << "\nDP Table:" << endl;
    cout << "Item\\Cap\t";
    for (int w = 0; w <= capacity; w++)
        cout << w << "\t";
    cout << endl;
    for (int i = 0; i <= n; i++) {
        cout << "Item " << i << "\t\t";
        for (int w = 0; w <= capacity; w++)
            cout << dp[i][w] << "\t";
        cout << endl;
    }

    cout << "\nMaximum value: " << dp[n][capacity] << endl;
    cout << "Items selected (1-indexed): ";
    int w = capacity;
    for (int i = n; i > 0; i--) {
        if (dp[i][w] != dp[i - 1][w]) {
            cout << i << " ";
            w -= wt[i - 1];
        }
    }
    cout << endl;

    return 0;
}
