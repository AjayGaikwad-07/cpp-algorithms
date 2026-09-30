#include <iostream>
#include <vector>

using namespace std;

// Check if adding vertex v to path[pos] is valid
bool isSafeVertex(int v, const vector<vector<int>>& graph, const vector<int>& path, int pos) {
    // Check if adjacent to previous vertex in path
    if (graph[path[pos - 1]][v] == 0) {
        return false;
    }

    // Check if vertex is already included
    for (int i = 0; i < pos; i++) {
        if (path[i] == v) {
            return false;
        }
    }
    return true;
}

bool solveHamiltonianCycle(int pos, int V, const vector<vector<int>>& graph, vector<int>& path, int& statesExplored) {
    statesExplored++;

    // Base Case: All vertices are included in path
    if (pos == V) {
        // Check if there is an edge from the last vertex back to the start vertex
        if (graph[path[pos - 1]][path[0]] == 1) {
            return true;
        }
        return false;
    }

    // Try candidate vertices for next position
    for (int v = 1; v < V; v++) {
        if (isSafeVertex(v, graph, path, pos)) {
            path[pos] = v;
            if (solveHamiltonianCycle(pos + 1, V, graph, path, statesExplored)) {
                return true;
            }
            path[pos] = -1; // Backtrack
        }
    }
    return false;
}

int main() {
    int V, E;
    cout << "Enter number of vertices (V): ";
    if (!(cin >> V)) return 0;
    cout << "Enter number of edges (E): ";
    if (!(cin >> E)) return 0;

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

    vector<int> path(V, -1);
    path[0] = 0; // Fix start vertex as 0 to avoid rotation duplicates
    int statesExplored = 0;

    cout << "\n========================================" << endl;
    cout << "   HAMILTONIAN CYCLE / PATH (BACKTRACKING)  " << endl;
    cout << "========================================" << endl;

    if (solveHamiltonianCycle(1, V, graph, path, statesExplored)) {
        cout << "\nHamiltonian Cycle Found!" << endl;
        cout << "Cycle Sequence: ";
        for (int i = 0; i < V; i++) {
            cout << path[i] << " -> ";
        }
        cout << path[0] << endl;
    } else {
        cout << "\nNo Hamiltonian Cycle exists for this graph configuration." << endl;
    }

    cout << "\n---------------- Exploration Metrics ----------------" << endl;
    cout << "Vertices: " << V << " | Edges: " << E << endl;
    cout << "State-Space Tree Calls: " << statesExplored << endl;

    return 0;
}
