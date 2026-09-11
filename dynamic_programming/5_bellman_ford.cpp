#include <iostream>
using namespace std;

#define INF 9999

struct Edge {
    int u, v, w;
};

int main() {
    int n, e;
    cout << "Enter number of vertices: ";
    cin >> n;
    cout << "Enter number of edges: ";
    cin >> e;

    Edge edges[100];
    cout << "Enter edges (from to weight):" << endl;
    for (int i = 0; i < e; i++) {
        cin >> edges[i].u >> edges[i].v >> edges[i].w;
    }

    int src;
    cout << "Enter source vertex: ";
    cin >> src;

    int dist[100];
    for (int i = 0; i < n; i++)
        dist[i] = INF;
    dist[src] = 0;

    // Relax all edges (n-1) times
    for (int step = 1; step <= n - 1; step++) {
        for (int i = 0; i < e; i++) {
            int u = edges[i].u;
            int v = edges[i].v;
            int w = edges[i].w;
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }

    // Check for negative weight cycles (nth relaxation)
    bool negCycle = false;
    for (int i = 0; i < e; i++) {
        int u = edges[i].u;
        int v = edges[i].v;
        int w = edges[i].w;
        if (dist[u] != INF && dist[u] + w < dist[v]) {
            negCycle = true;
            break;
        }
    }

    if (negCycle) {
        cout << "\nNegative weight cycle detected! Bellman-Ford cannot solve this." << endl;
        return 0;
    }

    cout << "\nShortest distances from vertex " << src << ":" << endl;
    for (int i = 0; i < n; i++) {
        cout << "To " << i << " : ";
        if (dist[i] == INF)
            cout << "Not reachable" << endl;
        else
            cout << dist[i] << endl;
    }

    return 0;
}
