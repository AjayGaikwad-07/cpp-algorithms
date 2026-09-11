#include <iostream>
using namespace std;

int findParent(int parent[], int i) {
    if (parent[i] == i)
        return i;
    return findParent(parent, parent[i]);
}

int main() {
    int n, e;
    cout << "Enter number of vertices: ";
    cin >> n;
    cout << "Enter number of edges: ";
    cin >> e;

    int u[100], v[100], w[100];

    cout << "Enter edges (from to weight):" << endl;
    for (int i = 0; i < e; i++) {
        cin >> u[i] >> v[i] >> w[i];
    }

    for (int i = 0; i < e - 1; i++) {
        for (int j = i + 1; j < e; j++) {
            if (w[i] > w[j]) {
                swap(w[i], w[j]);
                swap(u[i], u[j]);
                swap(v[i], v[j]);
            }
        }
    }

    int parent[100];
    for (int i = 0; i < n; i++) {
        parent[i] = i;
    }

    cout << "Minimum Spanning Tree edges:" << endl;
    int totalCost = 0;
    int edgeCount = 0;

    for (int i = 0; i < e && edgeCount < n - 1; i++) {
        int rootU = findParent(parent, u[i]);
        int rootV = findParent(parent, v[i]);

        if (rootU != rootV) {
            cout << u[i] << " - " << v[i] << " : " << w[i] << endl;
            totalCost += w[i];
            parent[rootU] = rootV;
            edgeCount++;
        }
    }

    cout << "Total MST cost: " << totalCost << endl;

    return 0;
}
