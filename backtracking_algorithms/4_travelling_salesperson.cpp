#include <iostream>
#include <vector>
#include <climits>
#include <iomanip>

using namespace std;

#define INF 999999

void tspBacktrack(int currCity, int count, int currentCost, int V,
                  const vector<vector<int>>& costMatrix,
                  vector<bool>& visited, vector<int>& currPath,
                  int& minCost, vector<int>& bestTour,
                  int& recursiveCalls, int& prunedBranches) {
    recursiveCalls++;

    // Prune branch if current cost already exceeds or equals the minimum cost found so far (Branch & Bound pruning)
    if (currentCost >= minCost) {
        prunedBranches++;
        return;
    }

    // Base case: all cities have been visited
    if (count == V) {
        // Check if there is a returning edge from currCity to start city (0)
        if (costMatrix[currCity][0] > 0 && costMatrix[currCity][0] != INF) {
            int totalCost = currentCost + costMatrix[currCity][0];
            if (totalCost < minCost) {
                minCost = totalCost;
                bestTour = currPath;
                bestTour.push_back(0); // Complete cycle
            }
        }
        return;
    }

    // Try visiting all unvisited adjacent cities
    for (int nextCity = 0; nextCity < V; nextCity++) {
        if (!visited[nextCity] && costMatrix[currCity][nextCity] > 0 && costMatrix[currCity][nextCity] != INF) {
            visited[nextCity] = true;
            currPath.push_back(nextCity);

            tspBacktrack(nextCity, count + 1, currentCost + costMatrix[currCity][nextCity],
                         V, costMatrix, visited, currPath, minCost, bestTour,
                         recursiveCalls, prunedBranches);

            // Backtrack state
            visited[nextCity] = false;
            currPath.pop_back();
        }
    }
}

int main() {
    int V;
    cout << "Enter number of cities (Vertices V): ";
    if (!(cin >> V) || V <= 0) return 0;

    vector<vector<int>> costMatrix(V, vector<int>(V, 0));
    cout << "Enter " << V << " x " << V << " Cost Matrix (0 for self, -1 or 9999 for infinity):" << endl;
    for (int i = 0; i < V; i++) {
        for (int j = 0; j < V; j++) {
            cin >> costMatrix[i][j];
            if (costMatrix[i][j] < 0) costMatrix[i][j] = INF;
        }
    }

    vector<bool> visited(V, false);
    visited[0] = true;
    vector<int> currPath = {0};
    vector<int> bestTour;
    int minCost = INT_MAX;
    int recursiveCalls = 0;
    int prunedBranches = 0;

    cout << "\n==================================================" << endl;
    cout << "  TRAVELLING SALESPERSON (EXACT BACKTRACKING)     " << endl;
    cout << "==================================================" << endl;

    tspBacktrack(0, 1, 0, V, costMatrix, visited, currPath, minCost, bestTour, recursiveCalls, prunedBranches);

    if (minCost != INT_MAX) {
        cout << "\nOptimal Tour Found!" << endl;
        cout << "Minimum Cost: " << minCost << endl;
        cout << "Tour Sequence: ";
        for (size_t i = 0; i < bestTour.size(); i++) {
            cout << bestTour[i];
            if (i + 1 < bestTour.size()) cout << " -> ";
        }
        cout << endl;
    } else {
        cout << "\nNo valid Hamiltonian Tour could be formed." << endl;
    }

    cout << "\n---------------- Exploration Analytics ----------------" << endl;
    cout << "Total Cities (V): " << V << endl;
    cout << "State-Space Tree Calls: " << recursiveCalls << endl;
    cout << "Branches Pruned (Bounding): " << prunedBranches << endl;

    return 0;
}
