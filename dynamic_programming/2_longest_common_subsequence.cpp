#include <iostream>
#include <string>
using namespace std;

int main() {
    string s1, s2;
    cout << "Enter first string: ";
    cin >> s1;
    cout << "Enter second string: ";
    cin >> s2;

    int m = s1.length();
    int n = s2.length();
    int dp[100][100] = {0};

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1[i - 1] == s2[j - 1])
                dp[i][j] = dp[i - 1][j - 1] + 1;
            else
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }

    cout << "\nDP Table:" << endl;
    cout << "    ";
    for (int j = 0; j < n; j++)
        cout << s2[j] << " ";
    cout << endl;
    for (int i = 1; i <= m; i++) {
        cout << s1[i - 1] << " : ";
        for (int j = 1; j <= n; j++)
            cout << dp[i][j] << " ";
        cout << endl;
    }

    string lcs = "";
    int i = m, j = n;
    while (i > 0 && j > 0) {
        if (s1[i - 1] == s2[j - 1]) {
            lcs = s1[i - 1] + lcs;
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }

    cout << "\nLength of LCS: " << dp[m][n] << endl;
    cout << "LCS: " << lcs << endl;

    return 0;
}
