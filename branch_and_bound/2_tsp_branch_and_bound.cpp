#include <iostream>
#include <vector>
#include <climits>

using namespace std;

#define INF 999999

int V;
vector<vector<int>> costMatrix;
vector<int> finalPath, currentPath;
vector<bool> visited;
int minCost = INT_MAX;

int getFirstMin(int i) {
    int m = INT_MAX;
    for (int j = 0; j < V; j++) {
        if (costMatrix[i][j] < m && i != j)
            m = costMatrix[i][j];
    }
    return m;
}

int getSecondMin(int i) {
    int first = INT_MAX, second = INT_MAX;
    for (int j = 0; j < V; j++) {
        if (i == j) continue;
        if (costMatrix[i][j] <= first) {
            second = first;
            first = costMatrix[i][j];
        } else if (costMatrix[i][j] < second) {
            second = costMatrix[i][j];
        }
    }
    return second;
}

void tspBranchAndBound(int currBound, int currCost, int level) {
    if (level == V) {
        int last = currentPath[level - 1];
        int start = currentPath[0];
        if (costMatrix[last][start] != INF) {
            int totalCost = currCost + costMatrix[last][start];
            if (totalCost < minCost) {
                currentPath[V] = start;
                finalPath = currentPath;
                minCost = totalCost;
            }
        }
        return;
    }

    for (int i = 0; i < V; i++) {
        int u = currentPath[level - 1];
        if (costMatrix[u][i] != INF && !visited[i]) {
            int tempBound = currBound;
            currCost += costMatrix[u][i];

            if (level == 1)
                currBound -= (getFirstMin(u) + getFirstMin(i)) / 2;
            else
                currBound -= (getSecondMin(u) + getFirstMin(i)) / 2;

            if (currBound + currCost < minCost) {
                currentPath[level] = i;
                visited[i] = true;
                tspBranchAndBound(currBound, currCost, level + 1);
                visited[i] = false;
            }

            currCost -= costMatrix[u][i];
            currBound = tempBound;
        }
    }
}

int main() {
    cout << "Enter number of cities: ";
    if (!(cin >> V) || V <= 0) {
        V = 4;
        costMatrix = {
            {INF, 10, 15, 20},
            {10, INF, 35, 25},
            {15, 35, INF, 30},
            {20, 25, 30, INF}
        };
    } else {
        costMatrix.assign(V, vector<int>(V));
        cout << "Enter cost matrix:\n";
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                cin >> costMatrix[i][j];
                if (i == j || costMatrix[i][j] < 0) costMatrix[i][j] = INF;
            }
        }
    }

    currentPath.assign(V + 1, 0);
    visited.assign(V, false);

    int initialBound = 0;
    for (int i = 0; i < V; i++)
        initialBound += (getFirstMin(i) + getSecondMin(i));
    initialBound = (initialBound & 1) ? (initialBound / 2 + 1) : (initialBound / 2);

    visited[0] = true;
    currentPath[0] = 0;

    tspBranchAndBound(initialBound, 0, 1);

    cout << "\nMinimum Cost: " << minCost << endl;
    cout << "Optimal Tour: ";
    for (size_t i = 0; i < finalPath.size(); i++) {
        cout << finalPath[i];
        if (i < finalPath.size() - 1) cout << " -> ";
    }
    cout << endl;

    return 0;
}
