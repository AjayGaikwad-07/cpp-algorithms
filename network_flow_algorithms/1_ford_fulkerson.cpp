#include <iostream>
#include <vector>
#include <queue>
#include <climits>

using namespace std;

bool bfs(const vector<vector<int>>& rGraph, int s, int t, vector<int>& parent, int V) {
    vector<bool> visited(V, false);
    queue<int> q;
    q.push(s);
    visited[s] = true;
    parent[s] = -1;

    while (!q.empty()) {
        int u = q.front();
        q.pop();

        for (int v = 0; v < V; v++) {
            if (!visited[v] && rGraph[u][v] > 0) {
                parent[v] = u;
                if (v == t) return true;
                visited[v] = true;
                q.push(v);
            }
        }
    }
    return false;
}

int fordFulkerson(const vector<vector<int>>& graph, int s, int t, int V, int& augmentations) {
    vector<vector<int>> rGraph = graph;
    vector<int> parent(V);
    int maxFlow = 0;
    augmentations = 0;

    while (bfs(rGraph, s, t, parent, V)) {
        int pathFlow = INT_MAX;
        for (int v = t; v != s; v = parent[v]) {
            int u = parent[v];
            pathFlow = min(pathFlow, rGraph[u][v]);
        }

        for (int v = t; v != s; v = parent[v]) {
            int u = parent[v];
            rGraph[u][v] -= pathFlow;
            rGraph[v][u] += pathFlow;
        }

        maxFlow += pathFlow;
        augmentations++;
    }

    return maxFlow;
}

int main() {
    int V, E, s, t;
    cout << "Enter number of vertices and edges: ";
    if (!(cin >> V >> E) || V <= 0) {
        V = 6;
        s = 0;
        t = 5;
        vector<vector<int>> graph(V, vector<int>(V, 0));
        graph[0][1] = 16;
        graph[0][2] = 13;
        graph[1][2] = 10;
        graph[1][3] = 12;
        graph[2][1] = 4;
        graph[2][4] = 14;
        graph[3][2] = 9;
        graph[3][5] = 20;
        graph[4][3] = 7;
        graph[4][5] = 4;

        int augmentations = 0;
        cout << "\nUsing default flow network (6 vertices, Source: 0, Sink: 5)" << endl;
        cout << "Maximum Flow: " << fordFulkerson(graph, s, t, V, augmentations) << endl;
        cout << "Augmenting Paths Found: " << augmentations << endl;
        return 0;
    }

    vector<vector<int>> graph(V, vector<int>(V, 0));
    cout << "Enter edges (u v capacity):\n";
    for (int i = 0; i < E; i++) {
        int u, v, cap;
        cin >> u >> v >> cap;
        graph[u][v] = cap;
    }

    cout << "Enter source and sink: ";
    cin >> s >> t;

    int augmentations = 0;
    cout << "\nMaximum Flow: " << fordFulkerson(graph, s, t, V, augmentations) << endl;
    cout << "Augmenting Paths Found: " << augmentations << endl;
    return 0;
}
