#include <iostream>
#include <string>
#include <vector>
#include <chrono>
#include <iomanip>

using namespace std;

// Naive Pattern Matching with comparison counter
int naiveMatching(const string& text, const string& pattern, vector<int>& matches) {
    int n = text.length();
    int m = pattern.length();
    int comparisons = 0;
    matches.clear();

    for (int i = 0; i <= n - m; i++) {
        int j = 0;
        while (j < m) {
            comparisons++;
            if (text[i + j] != pattern[j]) break;
            j++;
        }
        if (j == m) {
            matches.push_back(i);
        }
    }
    return comparisons;
}

// KMP LPS computation
vector<int> buildLPS(const string& pattern, int& lpsComparisons) {
    int m = pattern.length();
    vector<int> lps(m, 0);
    int len = 0;
    int i = 1;
    lpsComparisons = 0;

    while (i < m) {
        lpsComparisons++;
        if (pattern[i] == pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}

// KMP Matching with comparison counter
int kmpMatching(const string& text, const string& pattern, vector<int>& matches) {
    int n = text.length();
    int m = pattern.length();
    int lpsComparisons = 0;
    vector<int> lps = buildLPS(pattern, lpsComparisons);

    int i = 0;
    int j = 0;
    int searchComparisons = 0;
    matches.clear();

    while (i < n) {
        searchComparisons++;
        if (pattern[j] == text[i]) {
            i++;
            j++;
        }

        if (j == m) {
            matches.push_back(i - j);
            j = lps[j - 1];
        } else if (i < n && pattern[j] != text[i]) {
            if (j != 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    return lpsComparisons + searchComparisons;
}

void runBenchmark(const string& testName, const string& text, const string& pattern) {
    vector<int> naiveMatches, kmpMatches;

    auto t1 = chrono::high_resolution_clock::now();
    int naiveComp = naiveMatching(text, pattern, naiveMatches);
    auto t2 = chrono::high_resolution_clock::now();
    double naiveTime = chrono::duration<double, micro>(t2 - t1).count();

    auto t3 = chrono::high_resolution_clock::now();
    int kmpComp = kmpMatching(text, pattern, kmpMatches);
    auto t4 = chrono::high_resolution_clock::now();
    double kmpTime = chrono::duration<double, micro>(t4 - t3).count();

    cout << "================================================================" << endl;
    cout << "Test Scenario: " << testName << endl;
    cout << "Text Length (N): " << text.length() << " | Pattern Length (M): " << pattern.length() << endl;
    cout << "Matches Found  : " << kmpMatches.size() << endl;
    cout << "----------------------------------------------------------------" << endl;
    cout << left << setw(18) << "Algorithm" 
         << setw(20) << "Comparisons" 
         << setw(16) << "Time (microsec)" 
         << setw(14) << "Complexity" << endl;
    cout << "----------------------------------------------------------------" << endl;
    cout << left << setw(18) << "Naive Approach" 
         << setw(20) << naiveComp 
         << setw(16) << fixed << setprecision(2) << naiveTime 
         << setw(14) << "O((N-M+1)*M)" << endl;
    cout << left << setw(18) << "KMP Algorithm" 
         << setw(20) << kmpComp 
         << setw(16) << fixed << setprecision(2) << kmpTime 
         << setw(14) << "O(N + M)" << endl;
    cout << "----------------------------------------------------------------" << endl;
    
    double reduction = (naiveComp > 0) ? ((double)(naiveComp - kmpComp) / naiveComp * 100.0) : 0;
    if (reduction > 0) {
        cout << ">> KMP reduced character comparisons by: " << fixed << setprecision(2) << reduction << "%\n";
    } else {
        cout << ">> Naive performed comparably for this simple pattern.\n";
    }
    cout << endl;
}

int main() {
    cout << "================================================================" << endl;
    cout << "  PATTERN MATCHING PERFORMANCE & COMPLEXITY ANALYSIS BENCHMARK  " << endl;
    cout << "================================================================\n" << endl;

    // 1. Average Case: Natural Language text
    string text1 = "A_QUICK_BROWN_FOX_JUMPS_OVER_THE_LAZY_DOG_WHILE_SEARCHING_PATTERN";
    string pat1 = "SEARCH";
    runBenchmark("1. Standard / Average Case (Natural String)", text1, pat1);

    // 2. Worst Case for Naive: Highly repetitive text with pattern mismatch at end
    string text2 = string(2000, 'A') + "B";
    string pat2 = string(50, 'A') + "B";
    runBenchmark("2. Worst Case for Naive (Heavy Repetition A...AB)", text2, pat2);

    // 3. DNA / Genomic Sequence with overlapping repeats
    string text3 = "AGCTAGCTAGCTAGGCTAAGCTAGCTAGCTAGCTACGGATCGATCGATC";
    string pat3 = "AGCTAGCTA";
    runBenchmark("3. Genomic Pattern with Overlapping Substrings", text3, pat3);

    return 0;
}
