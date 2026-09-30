#include <iostream>
#include <string>
#include <vector>

using namespace std;

void naiveStringMatch(const string& text, const string& pattern) {
    int n = text.length();
    int m = pattern.length();
    vector<int> matches;
    int comparisons = 0;

    cout << "--- Step-by-Step Naive String Matching ---" << endl;
    for (int i = 0; i <= n - m; i++) {
        int j = 0;
        while (j < m) {
            comparisons++;
            if (text[i + j] != pattern[j]) {
                break;
            }
            j++;
        }

        if (j == m) {
            matches.push_back(i);
            cout << "Shift " << i << ": Pattern found at index " << i << endl;
        } else {
            cout << "Shift " << i << ": Mismatch at pattern index " << j 
                 << " ('" << text[i + j] << "' != '" << pattern[j] << "')" << endl;
        }
    }

    cout << "\n---------------- Result Summary ----------------" << endl;
    cout << "Text Length (N): " << n << endl;
    cout << "Pattern Length (M): " << m << endl;
    cout << "Total Character Comparisons: " << comparisons << endl;

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

    naiveStringMatch(text, pattern);
    return 0;
}
