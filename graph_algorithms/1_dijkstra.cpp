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

    int src;
    cout << "Enter source vertex: ";
    cin >> src;

    int dist[10];
    bool visited[10];

    for (int i = 0; i < n; i++) {
        dist[i] = 9999;
        visited[i] = false;
    }
    dist[src] = 0;

    for (int step = 0; step < n - 1; step++) {
        int u = -1;
        for (int i = 0; i < n; i++) {
            if (!visited[i] && (u == -1 || dist[i] < dist[u])) {
                u = i;
            }
        }

        visited[u] = true;

        for (int v = 0; v < n; v++) {
            if (graph[u][v] != 0 && !visited[v]) {
                if (dist[u] + graph[u][v] < dist[v]) {
                    dist[v] = dist[u] + graph[u][v];
                }
            }
        }
    }

    cout << "Shortest distances from vertex " << src << ":" << endl;
    for (int i = 0; i < n; i++) {
        cout << "To " << i << " : ";
        if (dist[i] == 9999)
            cout << "Not reachable" << endl;
        else
            cout << dist[i] << endl;
    }

    return 0;
}
