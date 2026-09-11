#include <iostream>
using namespace std;

#define INF 9999

int main() {
    int n;
    cout << "Enter number of vertices: ";
    cin >> n;

    int dist[10][10];

    cout << "Enter adjacency matrix (use 9999 for no edge):" << endl;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            cin >> dist[i][j];
        }
    }

    // Set diagonal to 0
    for (int i = 0; i < n; i++)
        dist[i][i] = 0;

    // Floyd-Warshall: try each vertex k as intermediate
    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (dist[i][k] != INF && dist[k][j] != INF) {
                    if (dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }
    }

    // Check for negative weight cycles
    bool negCycle = false;
    for (int i = 0; i < n; i++) {
        if (dist[i][i] < 0) {
            negCycle = true;
            break;
        }
    }

    if (negCycle) {
        cout << "\nNegative weight cycle detected!" << endl;
        return 0;
    }

    cout << "\nAll-Pairs Shortest Path Matrix:" << endl;
    cout << "\t";
    for (int j = 0; j < n; j++)
        cout << j << "\t";
    cout << endl;

    for (int i = 0; i < n; i++) {
        cout << i << "\t";
        for (int j = 0; j < n; j++) {
            if (dist[i][j] == INF)
                cout << "INF\t";
            else
                cout << dist[i][j] << "\t";
        }
        cout << endl;
    }

    return 0;
}
