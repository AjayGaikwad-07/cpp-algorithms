#include <iostream>
#include <iomanip>

using namespace std;

int main() {
    cout << "========================================================================\n";
    cout << "           NETWORK FLOW ALGORITHMS: COMPARATIVE ANALYSIS               \n";
    cout << "========================================================================\n\n";

    cout << left << setw(28) << "Metric / Feature" 
         << setw(26) << "Ford-Fulkerson (Edmonds-Karp)" 
         << "Push-Relabel (Goldberg-Tarjan)\n";
    cout << string(76, '-') << "\n";

    cout << left << setw(28) << "Algorithm Paradigm" 
         << setw(26) << "Global Augmenting Path (BFS)" 
         << "Local Preflow Push & Relabel\n";

    cout << left << setw(28) << "Worst-Case Complexity" 
         << setw(26) << "O(V * E^2)" 
         << "O(V^2 * E) / O(V^3)\n";

    cout << left << setw(28) << "Space Complexity" 
         << setw(26) << "O(V + E)" 
         << "O(V^2)\n";

    cout << left << setw(28) << "Dense Graphs (E ~ V^2)" 
         << setw(26) << "Slower: O(V^5)" 
         << "Fastest: O(V^3)\n";

    cout << left << setw(28) << "Sparse Graphs (E ~ V)" 
         << setw(26) << "Fast: O(V^3)" 
         << "O(V^3)\n";

    cout << left << setw(28) << "Parallelizable" 
         << setw(26) << "No (Global BFS dependent)" 
         << "Yes (Local vertex ops)\n";

    cout << left << setw(28) << "Applicability" 
         << setw(26) << "Bipartite Match, Simple Nets" 
         << "Dense Graphs, Computer Vision\n";

    cout << string(76, '-') << "\n";

    return 0;
}
