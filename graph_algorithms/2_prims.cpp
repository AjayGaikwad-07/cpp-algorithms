#include <iostream>
using namespace std;

int main() {
    int n, e;
    cout << "Enter number of vertices: ";
    cin >> n;
    cout << "Enter number of edges: ";
    cin >> e;

    int graph[10][10] = {0};

    cout << "Enter edges (from to weight):" << endl;
    for (int i = 0; i < e; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        graph[u][v] = w;
        graph[v][u] = w;
    }

    int key[10];
    int parent[10];
    bool inMST[10];

    for (int i = 0; i < n; i++) {
        key[i] = 9999;
        inMST[i] = false;
        parent[i] = -1;
    }
    key[0] = 0;

    for (int count = 0; count < n - 1; count++) {
        int u = -1;
        for (int i = 0; i < n; i++) {
            if (!inMST[i] && (u == -1 || key[i] < key[u])) {
                u = i;
            }
        }

        inMST[u] = true;

        for (int v = 0; v < n; v++) {
            if (graph[u][v] != 0 && !inMST[v] && graph[u][v] < key[v]) {
                key[v] = graph[u][v];
                parent[v] = u;
            }
        }
    }

    cout << "Minimum Spanning Tree edges:" << endl;
    int totalCost = 0;
    for (int i = 1; i < n; i++) {
        cout << parent[i] << " - " << i << " : " << graph[parent[i]][i] << endl;
        totalCost += graph[parent[i]][i];
    }
    cout << "Total MST cost: " << totalCost << endl;

    return 0;
}
