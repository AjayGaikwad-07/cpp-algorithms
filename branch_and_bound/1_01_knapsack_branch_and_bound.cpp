#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
#include <iomanip>

using namespace std;

struct Item {
    int id;
    int weight;
    int value;
    double ratio;
};

struct Node {
    int level;
    int profit;
    int weight;
    double bound;
    vector<int> takenItems;

    bool operator<(const Node& other) const {
        return bound < other.bound;
    }
};

double calculateBound(const Node& u, int n, int W, const vector<Item>& items) {
    if (u.weight >= W) return 0.0;

    double profitBound = u.profit;
    int currentWeight = u.weight;
    int j = u.level + 1;

    while (j < n && currentWeight + items[j].weight <= W) {
        currentWeight += items[j].weight;
        profitBound += items[j].value;
        j++;
    }

    if (j < n) {
        profitBound += (W - currentWeight) * items[j].ratio;
    }

    return profitBound;
}

void knapsackBranchAndBound(int W, vector<Item>& items, int n) {
    sort(items.begin(), items.end(), [](const Item& a, const Item& b) {
        return a.ratio > b.ratio;
    });

    priority_queue<Node> pq;

    Node root;
    root.level = -1;
    root.profit = 0;
    root.weight = 0;
    root.bound = calculateBound(root, n, W, items);
    pq.push(root);

    int maxProfit = 0;
    vector<int> bestItems;
    int nodesExplored = 0;
    int branchesPruned = 0;

    cout << "\n========================================================" << endl;
    cout << "  0/1 KNAPSACK: BRANCH AND BOUND (BEST-FIRST SEARCH)    " << endl;
    cout << "========================================================" << endl;
    cout << left << setw(8) << "Step" 
         << setw(8) << "Level" 
         << setw(10) << "Weight" 
         << setw(10) << "Profit" 
         << setw(12) << "Bound" 
         << "Action / Decision" << endl;
    cout << string(68, '-') << endl;

    int step = 0;

    while (!pq.empty()) {
        Node current = pq.top();
        pq.pop();
        step++;

        if (current.bound <= maxProfit) {
            branchesPruned++;
            cout << left << setw(8) << step 
                 << setw(8) << current.level 
                 << setw(10) << current.weight 
                 << setw(10) << current.profit 
                 << setw(12) << fixed << setprecision(2) << current.bound 
                 << "[PRUNED] Bound <= MaxProfit (" << maxProfit << ")" << endl;
            continue;
        }

        nodesExplored++;

        if (current.level == n - 1) continue;

        int nextLevel = current.level + 1;
        const Item& nextItem = items[nextLevel];

        Node leftChild;
        leftChild.level = nextLevel;
        leftChild.weight = current.weight + nextItem.weight;
        leftChild.profit = current.profit + nextItem.value;
        leftChild.takenItems = current.takenItems;
        leftChild.takenItems.push_back(nextItem.id);

        if (leftChild.weight <= W) {
            if (leftChild.profit > maxProfit) {
                maxProfit = leftChild.profit;
                bestItems = leftChild.takenItems;
            }

            leftChild.bound = calculateBound(leftChild, n, W, items);

            if (leftChild.bound > maxProfit) {
                pq.push(leftChild);
            } else {
                branchesPruned++;
            }
        } else {
            branchesPruned++;
        }

        Node rightChild;
        rightChild.level = nextLevel;
        rightChild.weight = current.weight;
        rightChild.profit = current.profit;
        rightChild.takenItems = current.takenItems;
        rightChild.bound = calculateBound(rightChild, n, W, items);

        if (rightChild.bound > maxProfit) {
            pq.push(rightChild);
        } else {
            branchesPruned++;
        }

        cout << left << setw(8) << step 
             << setw(8) << current.level 
             << setw(10) << current.weight 
             << setw(10) << current.profit 
             << setw(12) << fixed << setprecision(2) << current.bound 
             << "Branched on Item " << nextItem.id 
             << " (MaxProfit: " << maxProfit << ")" << endl;
    }

    cout << "\n---------------- Exploration Analytics ----------------" << endl;
    cout << "Total Capacity (W): " << W << endl;
    cout << "Total Items (n): " << n << endl;
    cout << "Active Nodes Explored: " << nodesExplored << endl;
    cout << "Branches Pruned by Bounding: " << branchesPruned << endl;
    cout << "========================================================" << endl;
    cout << "OPTIMAL MAXIMUM PROFIT: $" << maxProfit << endl;
    cout << "Selected Items (Original IDs): ";
    sort(bestItems.begin(), bestItems.end());
    for (size_t i = 0; i < bestItems.size(); i++) {
        cout << "Item " << bestItems[i];
        if (i + 1 < bestItems.size()) cout << ", ";
    }
    cout << "\n========================================================" << endl;
}

int main() {
    int n, W;
    cout << "Enter number of items: ";
    if (!(cin >> n) || n <= 0) {
        cout << "Using default demonstration dataset...\n";
        n = 4;
        W = 16;
        vector<Item> items = {
            {1, 2, 40, 40.0 / 2.0},
            {2, 5, 30, 30.0 / 5.0},
            {3, 10, 50, 50.0 / 10.0},
            {4, 5, 10, 10.0 / 5.0}
        };
        knapsackBranchAndBound(W, items, n);
        return 0;
    }

    vector<Item> items(n);
    cout << "Enter value and weight of each item:\n";
    for (int i = 0; i < n; i++) {
        items[i].id = i + 1;
        cin >> items[i].value >> items[i].weight;
        items[i].ratio = (double)items[i].value / items[i].weight;
    }

    cout << "Enter knapsack capacity W: ";
    cin >> W;

    knapsackBranchAndBound(W, items, n);
    return 0;
}
