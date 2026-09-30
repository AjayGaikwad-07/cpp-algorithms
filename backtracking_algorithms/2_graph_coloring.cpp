#include <iostream>
#include <vector>
#include <string>

using namespace std;

// Check if color assignment is safe for vertex v
bool isSafeColor(int v, const vector<vector<int>>& graph, const vector<int>& color, int c, int V) {
    for (int i = 0; i < V; i++) {
        if (graph[v][i] && color[i] == c) {
            return false;
        }
    }
    return true;
}

bool graphColoringUtil(int v, int m, int V, const vector<vector<int>>& graph, vector<int>& color, int& statesExplored) {
    statesExplored++;
    if (v == V) {
        return true; // All vertices successfully assigned
    }

    // Try assigning colors 1 to m
    for (int c = 1; c <= m; c++) {
        if (isSafeColor(v, graph, color, c, V)) {
            color[v] = c;
            if (graphColoringUtil(v + 1, m, V, graph, color, statesExplored)) {
                return true;
            }
            color[v] = 0; // Backtrack
        }
    }
    return false;
}

int main() {
    int V, E, m;
    cout << "Enter number of vertices (V): ";
    if (!(cin >> V)) return 0;
    cout << "Enter number of edges (E): ";
    if (!(cin >> E)) return 0;
    cout << "Enter maximum colors allowed (m): ";
    if (!(cin >> m)) return 0;

    vector<vector<int>> graph(V, vector<int>(V, 0));
    cout << "Enter " << E << " edges (u v):" << endl;
    for (int i = 0; i < E; i++) {
        int u, v;
        cin >> u >> v;
        if (u >= 0 && u < V && v >= 0 && v < V) {
            graph[u][v] = 1;
            graph[v][u] = 1;
        }
    }

    vector<int> color(V, 0);
    int statesExplored = 0;

    cout << "\n========================================" << endl;
    cout << "     GRAPH M-COLORING (BACKTRACKING)    " << endl;
    cout << "========================================" << endl;

    if (graphColoringUtil(0, m, V, graph, color, statesExplored)) {
        cout << "\nSolution exists! Assigned colors:" << endl;
        string colorNames[] = {"None", "Red", "Green", "Blue", "Yellow", "Purple", "Cyan", "Orange"};
        for (int i = 0; i < V; i++) {
            cout << "Vertex " << i << " -> Color " << color[i];
            if (color[i] <= 7) cout << " (" << colorNames[color[i]] << ")";
            cout << "\n";
        }
    } else {
        cout << "\nNo valid " << m << "-coloring configuration exists for this graph." << endl;
    }

    cout << "\n---------------- Exploration Metrics ----------------" << endl;
    cout << "Vertices: " << V << " | Edges: " << E << " | Max Colors (m): " << m << endl;
    cout << "State-Space Tree Recursions: " << statesExplored << endl;

    return 0;
}
