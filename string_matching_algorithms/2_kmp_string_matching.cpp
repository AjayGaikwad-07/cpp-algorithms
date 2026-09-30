#include <iostream>
#include <string>
#include <vector>

using namespace std;

// Function to compute the Longest Proper Prefix which is also Suffix (LPS) Array
vector<int> computeLPSArray(const string& pattern, int& lpsComparisons) {
    int m = pattern.length();
    vector<int> lps(m, 0);
    int len = 0; // length of previous longest prefix suffix
    int i = 1;

    while (i < m) {
        lpsComparisons++;
        if (pattern[i] == pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1]; // fallback without incrementing i
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}

void KMPSearch(const string& text, const string& pattern) {
    int n = text.length();
    int m = pattern.length();

    int lpsComparisons = 0;
    vector<int> lps = computeLPSArray(pattern, lpsComparisons);

    cout << "--- Computed LPS (Longest Prefix Suffix) Array ---" << endl;
    cout << "Index   : ";
    for (int k = 0; k < m; k++) cout << k << " ";
    cout << "\nPattern : ";
    for (int k = 0; k < m; k++) cout << pattern[k] << " ";
    cout << "\nLPS     : ";
    for (int k = 0; k < m; k++) cout << lps[k] << " ";
    cout << "\nLPS Preprocessing Comparisons: " << lpsComparisons << "\n" << endl;

    cout << "--- KMP Matching Execution ---" << endl;
    int i = 0; // index for text
    int j = 0; // index for pattern
    int searchComparisons = 0;
    vector<int> matches;

    while (i < n) {
        searchComparisons++;
        if (pattern[j] == text[i]) {
            i++;
            j++;
        }

        if (j == m) {
            int matchIdx = i - j;
            matches.push_back(matchIdx);
            cout << "Found match at text index " << matchIdx << endl;
            j = lps[j - 1]; // Use LPS to avoid redundant backtracking
        } else if (i < n && pattern[j] != text[i]) {
            if (j != 0) {
                // Skip matching characters using LPS value
                cout << "Mismatch at text index " << i << " (pattern index " << j 
                     << ") -> Resetting pattern index to " << lps[j - 1] << " using LPS" << endl;
                j = lps[j - 1];
            } else {
                cout << "Mismatch at text index " << i << " with first char -> Advancing text index" << endl;
                i++;
            }
        }
    }

    cout << "\n---------------- Result Summary ----------------" << endl;
    cout << "Text Length (N): " << n << endl;
    cout << "Pattern Length (M): " << m << endl;
    cout << "Search Phase Comparisons: " << searchComparisons << endl;
    cout << "Total Comparisons (LPS + Search): " << (lpsComparisons + searchComparisons) << endl;

    if (matches.empty()) {
        cout << "Pattern not found in the given text." << endl;
    } else {
        cout << "Pattern found " << matches.size() << " time(s) at 0-based index: ";
        for (int idx : matches) {
            cout << idx << " ";
        }
        cout << endl;
    }
}

int main() {
    string text, pattern;
    cout << "Enter Text: ";
    if (!(cin >> text)) return 0;
    cout << "Enter Pattern: ";
    if (!(cin >> pattern)) return 0;

    KMPSearch(text, pattern);
    return 0;
}
