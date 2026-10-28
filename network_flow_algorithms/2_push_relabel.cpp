#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>

using namespace std;

struct PushRelabel {
    int V;
    vector<vector<int>> capacity;
    vector<vector<int>> flow;
    vector<int> excess;
    vector<int> height;
    int pushCount;
    int relabelCount;

    PushRelabel(int n) : V(n), capacity(n, vector<int>(n, 0)),
                         flow(n, vector<int>(n, 0)),
                         excess(n, 0), height(n, 0),
                         pushCount(0), relabelCount(0) {}

    void addEdge(int u, int v, int cap) {
        capacity[u][v] += cap;
    }

    void push(int u, int v) {
        int send = min(excess[u], capacity[u][v] - flow[u][v]);
        flow[u][v] += send;
        flow[v][u] -= send;
        excess[u] -= send;
        excess[v] += send;
        pushCount++;
    }

    void relabel(int u) {
        int minHeight = INT_MAX;
        for (int v = 0; v < V; v++) {
            if (capacity[u][v] - flow[u][v] > 0) {
                minHeight = min(minHeight, height[v]);
            }
        }
        if (minHeight != INT_MAX) {
            height[u] = minHeight + 1;
            relabelCount++;
        }
    }

    int getOverfilledVertex(int s, int t) {
        for (int i = 0; i < V; i++) {
            if (i != s && i != t && excess[i] > 0)
                return i;
        }
        return -1;
    }

    int getMaxFlow(int s, int t) {
        height[s] = V;
        for (int v = 0; v < V; v++) {
            if (capacity[s][v] > 0) {
                flow[s][v] = capacity[s][v];
                flow[v][s] = -capacity[s][v];
                excess[v] = capacity[s][v];
                excess[s] -= capacity[s][v];
            }
        }

        while (true) {
            int u = getOverfilledVertex(s, t);
            if (u == -1) break;

            bool pushed = false;
            for (int v = 0; v < V; v++) {
                if (capacity[u][v] - flow[u][v] > 0 && height[u] == height[v] + 1) {
                    push(u, v);
                    pushed = true;
                    break;
                }
            }

            if (!pushed) {
                relabel(u);
            }
        }

        return excess[t];
    }
};

int main() {
    int V, E, s, t;
    cout << "Enter number of vertices and edges: ";
    if (!(cin >> V >> E) || V <= 0) {
        V = 6;
        s = 0;
        t = 5;
        PushRelabel pr(V);
        pr.addEdge(0, 1, 16);
        pr.addEdge(0, 2, 13);
        pr.addEdge(1, 2, 10);
        pr.addEdge(1, 3, 12);
        pr.addEdge(2, 1, 4);
        pr.addEdge(2, 4, 14);
        pr.addEdge(3, 2, 9);
        pr.addEdge(3, 5, 20);
        pr.addEdge(4, 3, 7);
        pr.addEdge(4, 5, 4);

        cout << "\nUsing default flow network (6 vertices, Source: 0, Sink: 5)" << endl;
        cout << "Maximum Flow: " << pr.getMaxFlow(s, t) << endl;
        cout << "Push Operations: " << pr.pushCount << endl;
        cout << "Relabel Operations: " << pr.relabelCount << endl;
        return 0;
    }

    PushRelabel pr(V);
    cout << "Enter edges (u v capacity):\n";
    for (int i = 0; i < E; i++) {
        int u, v, cap;
        cin >> u >> v >> cap;
        pr.addEdge(u, v, cap);
    }

    cout << "Enter source and sink: ";
    cin >> s >> t;

    cout << "\nMaximum Flow: " << pr.getMaxFlow(s, t) << endl;
    cout << "Push Operations: " << pr.pushCount << endl;
    cout << "Relabel Operations: " << pr.relabelCount << endl;
    return 0;
}
