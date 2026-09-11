export const ALGORITHMS = [
  // -------------------------------------------------------------
  // GRAPH ALGORITHMS
  // -------------------------------------------------------------
  {
    id: 'dijkstra',
    name: "Dijkstra's Shortest Path",
    category: 'graph',
    categoryName: 'Graph Algorithms',
    filePath: 'graph_algorithms/1_dijkstra.cpp',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V + E)',
    description: 'Finds the single-source shortest paths from a starting node to all other vertices in a weighted graph with non-negative edge weights using a Greedy approach with a priority queue.',
    realWorld: ['GPS & Map Navigation (Google Maps, Waze)', 'Network Routing Protocols (OSPF, IS-IS)', 'Robotics Path Planning'],
    steps: [
      'Initialize distance to source as 0 and all other nodes as infinity.',
      'Push source node (distance 0, source) into a Min-Priority Queue.',
      'Extract the node with minimum distance from the queue.',
      'For each adjacent neighbor, perform relaxation: if dist[u] + weight < dist[v], update dist[v] and push (dist[v], v) into queue.',
      'Repeat until the priority queue is empty.'
    ],
    pseudocode: [
      'dist[source] = 0, priority_queue PQ',
      'PQ.push((0, source))',
      'while PQ is not empty:',
      '  u = PQ.top().second, PQ.pop()',
      '  for each (neighbor v, weight w) of u:',
      '    if dist[u] + w < dist[v]:',
      '      dist[v] = dist[u] + w',
      '      PQ.push((dist[v], v))'
    ],
    defaultInput: '6 9\n0 1 4\n0 2 2\n1 2 1\n1 3 5\n2 3 8\n2 4 10\n3 4 2\n3 5 6\n4 5 3\n0',
    code: `#include <iostream>
#include <vector>
#include <queue>
#include <climits>

using namespace std;

typedef pair<int, int> pii; // {weight, node}

void dijkstra(int V, vector<vector<pii>>& adj, int src) {
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    vector<int> dist(V, INT_MAX);

    dist[src] = 0;
    pq.push({0, src});

    while (!pq.empty()) {
        int d = pq.top().first;
        int u = pq.top().second;
        pq.pop();

        if (d > dist[u]) continue;

        for (auto& edge : adj[u]) {
            int v = edge.first;
            int weight = edge.second;

            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }

    cout << "Vertex Distance from Source (" << src << "):\\n";
    for (int i = 0; i < V; ++i) {
        cout << "Node " << i << " : " << (dist[i] == INT_MAX ? -1 : dist[i]) << "\\n";
    }
}

int main() {
    int V = 6, E = 9;
    vector<vector<pii>> adj(V);

    // Hardcoded graph representation for demo execution
    vector<vector<int>> edges = {
        {0, 1, 4}, {0, 2, 2}, {1, 2, 1}, {1, 3, 5},
        {2, 3, 8}, {2, 4, 10}, {3, 4, 2}, {3, 5, 6}, {4, 5, 3}
    };

    for (auto& e : edges) {
        adj[e[0]].push_back({e[1], e[2]});
        adj[e[1]].push_back({e[0], e[2]});
    }

    dijkstra(V, adj, 0);
    return 0;
}
`
  },
  {
    id: 'prims',
    name: "Prim's Minimum Spanning Tree",
    category: 'graph',
    categoryName: 'Graph Algorithms',
    filePath: 'graph_algorithms/2_prims.cpp',
    timeComplexity: 'O(E log V)',
    spaceComplexity: 'O(V + E)',
    description: 'Greedy algorithm that finds a Minimum Spanning Tree (MST) for a weighted undirected graph by starting from an arbitrary node and repeatedly selecting the cheapest edge connected to the growing tree.',
    realWorld: ['Telecommunication & Fiber Optic Cable Layout', 'Electrical Grid Distribution Network Design', 'Water Supply Pipeline Systems'],
    steps: [
      'Select a starting node and mark it as visited.',
      'Insert all outgoing edges from visited nodes into a Min-Priority Queue.',
      'Pick the edge with the lowest weight connecting an unvisited vertex.',
      'Add vertex to the MST and include its outgoing edges to the priority queue.',
      'Repeat until all V vertices are included in the MST.'
    ],
    pseudocode: [
      'visited[0...V-1] = false',
      'PQ.push((0, start_node))',
      'while PQ is not empty and count < V:',
      '  (w, u) = PQ.top(), PQ.pop()',
      '  if u is visited: continue',
      '  mark u as visited, total_mst_weight += w',
      '  for each neighbor v of u:',
      '    if v not visited: PQ.push((weight(u,v), v))'
    ],
    defaultInput: '',
    code: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

typedef pair<int, int> pii;

int primMST(int V, vector<vector<pii>>& adj) {
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    vector<bool> inMST(V, false);
    int mstWeight = 0;

    pq.push({0, 0}); // {weight, node}

    while (!pq.empty()) {
        auto [weight, u] = pq.top();
        pq.pop();

        if (inMST[u]) continue;

        inMST[u] = true;
        mstWeight += weight;

        for (auto& edge : adj[u]) {
            int v = edge.first;
            int w = edge.second;
            if (!inMST[v]) {
                pq.push({w, v});
            }
        }
    }
    return mstWeight;
}

int main() {
    int V = 5;
    vector<vector<pii>> adj(V);

    vector<vector<int>> edges = {
        {0, 1, 2}, {0, 3, 6}, {1, 2, 3}, {1, 3, 8},
        {1, 4, 5}, {2, 4, 7}, {3, 4, 9}
    };

    for (auto& e : edges) {
        adj[e[0]].push_back({e[1], e[2]});
        adj[e[1]].push_back({e[0], e[2]});
    }

    cout << "Total Weight of Minimum Spanning Tree (Prim's): " << primMST(V, adj) << endl;
    return 0;
}
`
  },
  {
    id: 'kruskals',
    name: "Kruskal's Minimum Spanning Tree",
    category: 'graph',
    categoryName: 'Graph Algorithms',
    filePath: 'graph_algorithms/3_kruskals.cpp',
    timeComplexity: 'O(E log E)',
    spaceComplexity: 'O(V + E)',
    description: 'Greedy algorithm that sorts all edges by weight in non-decreasing order and adds edges to the MST one-by-one as long as they do not form a cycle (using Disjoint Set Union / DSU).',
    realWorld: ['Circuit Board Layout & Wiring', 'Cluster Analysis in Machine Learning', 'LAN Network Topology Design'],
    steps: [
      'Sort all edges in the graph in ascending order of weight.',
      'Initialize a Disjoint Set Union (DSU) data structure for V vertices.',
      'Iterate through sorted edges: if find(u) != find(v), unite(u, v) and add edge weight to MST.',
      'Stop when V-1 edges have been added.'
    ],
    pseudocode: [
      'sort(edges by weight)',
      'DSU dsu(V)',
      'for edge (u, v, w) in edges:',
      '  if dsu.find(u) != dsu.find(v):',
      '    dsu.unite(u, v)',
      '    mst_weight += w'
    ],
    defaultInput: '',
    code: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

struct Edge {
    int u, v, weight;
    bool operator<(const Edge& other) const {
        return weight < other.weight;
    }
};

class DSU {
    vector<int> parent, rank;
public:
    DSU(int n) {
        parent.resize(n);
        rank.resize(n, 0);
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]);
    }

    bool unite(int i, int j) {
        int root_i = find(i);
        int root_j = find(j);
        if (root_i != root_j) {
            if (rank[root_i] < rank[root_j]) swap(root_i, root_j);
            parent[root_j] = root_i;
            if (rank[root_i] == rank[root_j]) rank[root_i]++;
            return true;
        }
        return false;
    }
};

int main() {
    int V = 4;
    vector<Edge> edges = {
        {0, 1, 10}, {0, 2, 6}, {0, 3, 5}, {1, 3, 15}, {2, 3, 4}
    };

    sort(edges.begin(), edges.end());
    DSU dsu(V);
    int mstWeight = 0;

    cout << "Edges in Kruskal's MST:\\n";
    for (const auto& edge : edges) {
        if (dsu.unite(edge.u, edge.v)) {
            cout << edge.u << " -- " << edge.v << " == " << edge.weight << endl;
            mstWeight += edge.weight;
        }
    }

    cout << "Total MST Weight: " << mstWeight << endl;
    return 0;
}
`
  },

  // -------------------------------------------------------------
  // GREEDY ALGORITHMS
  // -------------------------------------------------------------
  {
    id: 'fractional_knapsack',
    name: 'Fractional Knapsack',
    category: 'greedy',
    categoryName: 'Greedy Algorithms',
    filePath: 'greedy_algorithms/1_fractional_knapsack.cpp',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    description: 'Computes the maximum value items that can fit into a knapsack of given weight capacity, allowing fractions of items to be taken by sorting by value-to-weight ratio.',
    realWorld: ['Resource Allocation & Cargo Loading', 'Financial Portfolio Optimization', 'Bandwidth Distribution'],
    steps: [
      'Calculate value-to-weight ratio (val/wt) for each item.',
      'Sort items in descending order of ratio.',
      'Take complete items as long as remaining capacity allows.',
      'If remaining item weight exceeds capacity, take the fraction (capacity / item_weight) and finish.'
    ],
    pseudocode: [
      'ratio[i] = val[i] / wt[i]',
      'sort items by ratio descending',
      'for item in items:',
      '  if wt <= capacity:',
      '    capacity -= wt, total_val += val',
      '  else:',
      '    total_val += val * (capacity / wt), break'
    ],
    defaultInput: '',
    code: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

struct Item {
    int value, weight;
};

bool cmp(Item a, Item b) {
    double r1 = (double)a.value / a.weight;
    double r2 = (double)b.value / b.weight;
    return r1 > r2;
}

double fractionalKnapsack(int W, vector<Item>& items) {
    sort(items.begin(), items.end(), cmp);

    double totalValue = 0.0;
    for (auto& item : items) {
        if (item.weight <= W) {
            W -= item.weight;
            totalValue += item.value;
        } else {
            totalValue += item.value * ((double)W / item.weight);
            break;
        }
    }
    return totalValue;
}

int main() {
    int W = 50;
    vector<Item> items = {{60, 10}, {100, 20}, {120, 30}};

    cout << "Maximum value in Knapsack = " << fractionalKnapsack(W, items) << endl;
    return 0;
}
`
  },
  {
    id: 'job_sequencing',
    name: 'Job Sequencing with Deadlines',
    category: 'greedy',
    categoryName: 'Greedy Algorithms',
    filePath: 'greedy_algorithms/2_job_sequencing.cpp',
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(N)',
    description: 'Schedules jobs to maximize total profit such that each job takes 1 unit of time and completes before or on its specified deadline.',
    realWorld: ['Task Scheduling in Operating Systems', 'Processor & Server Execution Pipelines', 'Airport Runway Scheduling'],
    steps: [
      'Sort jobs in decreasing order of profit.',
      'Find the maximum deadline to size the schedule array.',
      'For each job, search from its deadline backwards to find the latest empty slot.',
      'Place job in the slot and add profit to total.'
    ],
    pseudocode: [
      'sort jobs by profit descending',
      'for job in jobs:',
      '  for slot = job.deadline down to 1:',
      '    if slot is free:',
      '      occupy slot with job, total_profit += job.profit, break'
    ],
    defaultInput: '',
    code: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

struct Job {
    char id;
    int deadline;
    int profit;
};

bool comparison(Job a, Job b) {
    return (a.profit > b.profit);
}

void printJobScheduling(vector<Job>& arr) {
    sort(arr.begin(), arr.end(), comparison);

    int maxDeadline = 0;
    for (auto& j : arr) maxDeadline = max(maxDeadline, j.deadline);

    vector<char> result(maxDeadline + 1, '-');
    int totalProfit = 0;

    for (auto& job : arr) {
        for (int j = job.deadline; j > 0; j--) {
            if (result[j] == '-') {
                result[j] = job.id;
                totalProfit += job.profit;
                break;
            }
        }
    }

    cout << "Scheduled Job Sequence: ";
    for (int i = 1; i <= maxDeadline; i++) {
        if (result[i] != '-') cout << result[i] << " ";
    }
    cout << "\\nTotal Profit: " << totalProfit << endl;
}

int main() {
    vector<Job> arr = {
        {'a', 2, 100}, {'b', 1, 19}, {'c', 2, 27},
        {'d', 1, 25}, {'e', 3, 15}
    };
    printJobScheduling(arr);
    return 0;
}
`
  },
  {
    id: 'huffman_coding',
    name: 'Huffman Coding Data Compression',
    category: 'greedy',
    categoryName: 'Greedy Algorithms',
    filePath: 'greedy_algorithms/3_huffman_coding.cpp',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    description: 'Lossless data compression algorithm that assigns variable-length prefix codes to characters based on their frequency of occurrence (frequent characters get shorter binary codes).',
    realWorld: ['JPEG / MP3 / ZIP Lossless Compression', 'Gzip Data Encoding', 'PDF File Compression'],
    steps: [
      'Count character frequencies and create leaf nodes for each character.',
      'Push all nodes into a Min-Priority Queue ordered by frequency.',
      'Pop two lowest frequency nodes, merge into a parent node (freq = f1 + f2), and push back.',
      'Repeat until 1 root node remains.',
      'Traverse tree: assign 0 to left edge and 1 to right edge to generate binary codes.'
    ],
    pseudocode: [
      'PQ = priority_queue of leaf nodes',
      'while PQ.size() > 1:',
      '  left = PQ.pop(), right = PQ.pop()',
      '  parent = new Node(left.freq + right.freq, left, right)',
      '  PQ.push(parent)',
      'generate_codes(PQ.top(), "")'
    ],
    defaultInput: '',
    code: `#include <iostream>
#include <vector>
#include <queue>
#include <string>

using namespace std;

struct Node {
    char data;
    int freq;
    Node *left, *right;

    Node(char data, int freq) {
        this->data = data;
        this->freq = freq;
        left = right = nullptr;
    }
};

struct compare {
    bool operator()(Node* l, Node* r) {
        return (l->freq > r->freq);
    }
};

void printCodes(Node* root, string str) {
    if (!root) return;

    if (root->data != '$') {
        cout << root->data << ": " << str << "\\n";
    }
    printCodes(root->left, str + "0");
    printCodes(root->right, str + "1");
}

void HuffmanCodes(vector<char>& data, vector<int>& freq) {
    priority_queue<Node*, vector<Node*>, compare> minHeap;

    for (size_t i = 0; i < data.size(); ++i)
        minHeap.push(new Node(data[i], freq[i]));

    while (minHeap.size() != 1) {
        Node* left = minHeap.top(); minHeap.pop();
        Node* right = minHeap.top(); minHeap.pop();

        Node* top = new Node('$', left->freq + right->freq);
        top->left = left;
        top->right = right;

        minHeap.push(top);
    }

    cout << "Generated Huffman Codes:\\n";
    printCodes(minHeap.top(), "");
}

int main() {
    vector<char> arr = {'a', 'b', 'c', 'd', 'e', 'f'};
    vector<int> freq = {5, 9, 12, 13, 16, 45};

    HuffmanCodes(arr, freq);
    return 0;
}
`
  },
  {
    id: 'optimal_merge_pattern',
    name: 'Optimal Merge Pattern',
    category: 'greedy',
    categoryName: 'Greedy Algorithms',
    filePath: 'greedy_algorithms/4_optimal_merge_pattern.cpp',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    description: 'Finds the optimal pattern to merge N sorted files into a single sorted file such that the total number of record comparisons/movement operations is minimized.',
    realWorld: ['Database File Merging in External Sorting', 'Log File Aggregation', 'Big Data Batch Stream Processing'],
    steps: [
      'Push all file sizes into a Min-Priority Queue.',
      'Pop the two smallest files (size a and b).',
      'Merge them: cost = a + b.',
      'Add cost to total merge cost and push merged file (size cost) back into queue.',
      'Repeat until 1 single file remains.'
    ],
    pseudocode: [
      'PQ = priority_queue of file sizes',
      'while PQ.size() > 1:',
      '  a = PQ.pop(), b = PQ.pop()',
      '  cost = a + b',
      '  total_cost += cost',
      '  PQ.push(cost)'
    ],
    defaultInput: '',
    code: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

int minComputation(vector<int>& files) {
    priority_queue<int, vector<int>, greater<int>> pq;

    for (int file : files) pq.push(file);

    int totalCost = 0;

    while (pq.size() > 1) {
        int first = pq.top(); pq.pop();
        int second = pq.top(); pq.pop();

        int temp = first + second;
        totalCost += temp;
        pq.push(temp);
    }

    return totalCost;
}

int main() {
    vector<int> files = {2, 3, 4, 5, 6, 7};
    cout << "Minimum Computation / Comparison Cost for Merging: " << minComputation(files) << endl;
    return 0;
}
`
  },

  // -------------------------------------------------------------
  // SORTING ALGORITHMS
  // -------------------------------------------------------------
  {
    id: 'bubble_sort',
    name: 'Bubble Sort',
    category: 'sorting',
    categoryName: 'Sorting Algorithms',
    filePath: 'sorting_algorithms/1_bubble_sort.cpp',
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(1)',
    description: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order until the entire array is sorted.',
    realWorld: ['Educational Computer Science Concept Demonstration', 'Detecting small unsorted anomalies in nearly sorted arrays'],
    steps: [
      'Compare adjacent elements arr[j] and arr[j+1].',
      'If arr[j] > arr[j+1], swap them.',
      'After pass i, the largest unsorted element bubbles up to position N-1-i.',
      'If no swaps occur in a full pass, terminate early.'
    ],
    pseudocode: [
      'for i = 0 to N-1:',
      '  swapped = false',
      '  for j = 0 to N-i-2:',
      '    if arr[j] > arr[j+1]:',
      '      swap(arr[j], arr[j+1]), swapped = true',
      '  if not swapped: break'
    ],
    defaultInput: '',
    code: `#include <iostream>
#include <vector>

using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}

int main() {
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    bubbleSort(arr);

    cout << "Sorted Array (Bubble Sort): ";
    for (int x : arr) cout << x << " ";
    cout << endl;
    return 0;
}
`
  },
  {
    id: 'insertion_sort',
    name: 'Insertion Sort',
    category: 'sorting',
    categoryName: 'Sorting Algorithms',
    filePath: 'sorting_algorithms/2_insertion_sort.cpp',
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(1)',
    description: 'Builds the sorted array one item at a time by picking the next element and shifting larger elements to the right to insert it into its correct position.',
    realWorld: ['Sorting small arrays (N <= 20) in Hybrid Algorithms (Timsort, Introsort)', 'Online Streaming Data Insertion'],
    steps: [
      'Pick element arr[i] starting from index 1.',
      'Compare key with elements in sorted subarray arr[0...i-1].',
      'Shift elements greater than key one position to the right.',
      'Insert key into the correct vacant slot.'
    ],
    pseudocode: [
      'for i = 1 to N-1:',
      '  key = arr[i], j = i - 1',
      '  while j >= 0 and arr[j] > key:',
      '    arr[j+1] = arr[j], j--',
      '  arr[j+1] = key'
    ],
    defaultInput: '',
    code: `#include <iostream>
#include <vector>

using namespace std;

void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

int main() {
    vector<int> arr = {12, 11, 13, 5, 6};
    insertionSort(arr);

    cout << "Sorted Array (Insertion Sort): ";
    for (int x : arr) cout << x << " ";
    cout << endl;
    return 0;
}
`
  },
  {
    id: 'heap_sort',
    name: 'Heap Sort',
    category: 'sorting',
    categoryName: 'Sorting Algorithms',
    filePath: 'sorting_algorithms/3_heap_sort.cpp',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(1)',
    description: 'In-place comparison sort that transforms the array into a Max-Heap binary tree, repeatedly extracts the maximum element to the end, and heapifies the remaining structure.',
    realWorld: ['Priority Queue Implementations', 'Systems with strict O(1) extra space limits', 'Real-time Embedded Systems'],
    steps: [
      'Build a Max-Heap from input array.',
      'Swap root (maximum element) with the last element in array.',
      'Reduce heap size by 1.',
      'Heapify the root element down the tree.',
      'Repeat until heap size is 1.'
    ],
    pseudocode: [
      'build_max_heap(arr)',
      'for i = N-1 down to 1:',
      '  swap(arr[0], arr[i])',
      '  heapify(arr, i, 0)'
    ],
    defaultInput: '',
    code: `#include <iostream>
#include <vector>

using namespace std;

void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}

int main() {
    vector<int> arr = {12, 11, 13, 5, 6, 7};
    heapSort(arr);

    cout << "Sorted Array (Heap Sort): ";
    for (int x : arr) cout << x << " ";
    cout << endl;
    return 0;
}
`
  },
  {
    id: 'merge_sort',
    name: 'Merge Sort',
    category: 'sorting',
    categoryName: 'Sorting Algorithms',
    filePath: 'sorting_algorithms/4_merge_sort.cpp',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    description: 'Divide-and-Conquer algorithm that divides the input array into two halves, recursively sorts them, and merges the sorted halves back together.',
    realWorld: ['External Sorting of Large Files on Disk', 'Guaranteed O(N log N) Stable Sort Applications', 'Linked List Sorting'],
    steps: [
      'Divide array into left and right halves at mid = (left + right)/2.',
      'Recursively call mergeSort on left half.',
      'Recursively call mergeSort on right half.',
      'Merge sorted left and right subarrays into a temporary buffer and copy back.'
    ],
    pseudocode: [
      'mergeSort(arr, l, r):',
      '  if l >= r: return',
      '  mid = l + (r-l)/2',
      '  mergeSort(arr, l, mid)',
      '  mergeSort(arr, mid+1, r)',
      '  merge(arr, l, mid, r)'
    ],
    defaultInput: '',
    code: `#include <iostream>
#include <vector>

using namespace std;

void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> left(arr.begin() + l, arr.begin() + m + 1);
    vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);

    int i = 0, j = 0, k = l;
    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else arr[k++] = right[j++];
    }

    while (i < left.size()) arr[k++] = left[i++];
    while (j < right.size()) arr[k++] = right[j++];
}

void mergeSort(vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}

int main() {
    vector<int> arr = {38, 27, 43, 3, 9, 82, 10};
    mergeSort(arr, 0, arr.size() - 1);

    cout << "Sorted Array (Merge Sort): ";
    for (int x : arr) cout << x << " ";
    cout << endl;
    return 0;
}
`
  },
  {
    id: 'quick_sort',
    name: 'Quick Sort',
    category: 'sorting',
    categoryName: 'Sorting Algorithms',
    filePath: 'sorting_algorithms/5_quick_sort.cpp',
    timeComplexity: 'O(N log N) avg',
    spaceComplexity: 'O(log N)',
    description: 'Efficient divide-and-conquer algorithm that selects a pivot element, partitions the array such that elements smaller than pivot go left and larger go right, and recursively sorts the sub-arrays.',
    realWorld: ['Default System Standard Library Sorting (std::sort in C++)', 'High-performance In-Memory Sorting'],
    steps: [
      'Select a pivot element (e.g., last element).',
      'Partition array: move elements smaller than pivot to left.',
      'Place pivot in its final sorted index.',
      'Recursively apply quickSort to left subarray and right subarray.'
    ],
    pseudocode: [
      'quickSort(arr, low, high):',
      '  if low < high:',
      '    p = partition(arr, low, high)',
      '    quickSort(arr, low, p-1)',
      '    quickSort(arr, p+1, high)'
    ],
    defaultInput: '',
    code: `#include <iostream>
#include <vector>

using namespace std;

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);

    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return (i + 1);
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    vector<int> arr = {10, 7, 8, 9, 1, 5};
    quickSort(arr, 0, arr.size() - 1);

    cout << "Sorted Array (Quick Sort): ";
    for (int x : arr) cout << x << " ";
    cout << endl;
    return 0;
}
`
  },
  {
    id: 'selection_sort',
    name: 'Selection Sort',
    category: 'sorting',
    categoryName: 'Sorting Algorithms',
    filePath: 'sorting_algorithms/6_selection_sort.cpp',
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(1)',
    description: 'Simple sorting algorithm that repeatedly finds the minimum element from the unsorted part of the array and places it at the beginning.',
    realWorld: ['Systems where memory writes are extremely expensive (Flash memory)', 'Sorting small datasets with minimal code footprint'],
    steps: [
      'Find the minimum element in unsorted subarray arr[i...N-1].',
      'Swap minimum element with arr[i].',
      'Increment index i.',
      'Repeat until entire array is sorted.'
    ],
    pseudocode: [
      'for i = 0 to N-2:',
      '  min_idx = i',
      '  for j = i+1 to N-1:',
      '    if arr[j] < arr[min_idx]: min_idx = j',
      '  swap(arr[i], arr[min_idx])'
    ],
    defaultInput: '',
    code: `#include <iostream>
#include <vector>

using namespace std;

void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        swap(arr[min_idx], arr[i]);
    }
}

int main() {
    vector<int> arr = {64, 25, 12, 22, 11};
    selectionSort(arr);

    cout << "Sorted Array (Selection Sort): ";
    for (int x : arr) cout << x << " ";
    cout << endl;
    return 0;
}
`
  },
  // -------------------------------------------------------------
  // DYNAMIC PROGRAMMING ALGORITHMS
  // -------------------------------------------------------------
  {
    id: 'mcm',
    name: 'Matrix Chain Multiplication',
    category: 'dp',
    categoryName: 'Dynamic Programming',
    filePath: 'dynamic_programming/1_matrix_chain_multiplication.cpp',
    timeComplexity: 'O(n^3)',
    spaceComplexity: 'O(n^2)',
    description: 'Finds the optimal parenthesization of a chain of matrices to minimize the total number of scalar multiplications required using a bottom-up Dynamic Programming table.',
    realWorld: ['Graphics & Physics Engines Optimization', 'Database Query Optimization', 'Compiler Vector/Matrix Expressions'],
    steps: [
      'Define dimensions array p[] of size n+1 for n matrices.',
      'Initialize dp[i][i] = 0 for single matrices (chain length 1).',
      'Iterate over chain length len from 2 to n.',
      'For each subchain (i, j), try all split points k from i to j-1.',
      'Calculate cost: dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j].',
      'Store minimum cost in dp[i][j].'
    ],
    pseudocode: [
      'for i = 1 to n: dp[i][i] = 0',
      'for len = 2 to n:',
      '  for i = 1 to n - len + 1:',
      '    j = i + len - 1',
      '    dp[i][j] = INF',
      '    for k = i to j - 1:',
      '      cost = dp[i][k] + dp[k+1][j] + p[i-1]*p[k]*p[j]',
      '      dp[i][j] = min(dp[i][j], cost)'
    ],
    defaultInput: '4\n10 30 5 60 8',
    code: `#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Enter number of matrices: ";
    cin >> n;

    int p[20];
    cout << "Enter dimensions (p[0] to p[n]) - " << n + 1 << " values:" << endl;
    for (int i = 0; i <= n; i++) {
        cin >> p[i];
    }

    int dp[20][20] = {0};
    int split[20][20] = {0};

    for (int len = 2; len <= n; len++) {
        for (int i = 1; i <= n - len + 1; i++) {
            int j = i + len - 1;
            dp[i][j] = 99999;
            for (int k = i; k < j; k++) {
                int cost = dp[i][k] + dp[k + 1][j] + p[i - 1] * p[k] * p[j];
                if (cost < dp[i][j]) {
                    dp[i][j] = cost;
                    split[i][j] = k;
                }
            }
        }
    }

    cout << "\\nDP Table (minimum costs):" << endl;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            if (i > j)
                cout << "  -  ";
            else
                cout << dp[i][j] << "\\t";
        }
        cout << endl;
    }

    cout << "\\nMinimum number of multiplications: " << dp[1][n] << endl;

    return 0;
}
`
  },
  {
    id: 'lcs',
    name: 'Longest Common Subsequence',
    category: 'dp',
    categoryName: 'Dynamic Programming',
    filePath: 'dynamic_programming/2_longest_common_subsequence.cpp',
    timeComplexity: 'O(m * n)',
    spaceComplexity: 'O(m * n)',
    description: 'Finds the longest subsequence present in two sequences in the same relative order using a 2D Dynamic Programming table and backtracking.',
    realWorld: ['Git Diff & Version Control Code Comparison', 'Bioinformatics & DNA Sequence Alignment', 'Plagiarism Detection Software'],
    steps: [
      'Create 2D DP table of size (m+1) x (n+1) initialized with 0.',
      'If s1[i-1] == s2[j-1], dp[i][j] = dp[i-1][j-1] + 1.',
      'Otherwise, dp[i][j] = max(dp[i-1][j], dp[i][j-1]).',
      'After filling the table, backtrack from dp[m][n] to reconstruct the string.'
    ],
    pseudocode: [
      'for i = 1 to m:',
      '  for j = 1 to n:',
      '    if s1[i-1] == s2[j-1]:',
      '      dp[i][j] = dp[i-1][j-1] + 1',
      '    else:',
      '      dp[i][j] = max(dp[i-1][j], dp[i][j-1])'
    ],
    defaultInput: 'AGGTAB\nGXTXAYB',
    code: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string s1, s2;
    cout << "Enter first string: ";
    cin >> s1;
    cout << "Enter second string: ";
    cin >> s2;

    int m = s1.length();
    int n = s2.length();
    int dp[100][100] = {0};

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1[i - 1] == s2[j - 1])
                dp[i][j] = dp[i - 1][j - 1] + 1;
            else
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }

    cout << "\\nDP Table:" << endl;
    cout << "    ";
    for (int j = 0; j < n; j++)
        cout << s2[j] << " ";
    cout << endl;
    for (int i = 1; i <= m; i++) {
        cout << s1[i - 1] << " : ";
        for (int j = 1; j <= n; j++)
            cout << dp[i][j] << " ";
        cout << endl;
    }

    string lcs = "";
    int i = m, j = n;
    while (i > 0 && j > 0) {
        if (s1[i - 1] == s2[j - 1]) {
            lcs = s1[i - 1] + lcs;
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }

    cout << "\\nLength of LCS: " << dp[m][n] << endl;
    cout << "LCS: " << lcs << endl;

    return 0;
}
`
  },
  {
    id: 'knapsack01',
    name: '0/1 Knapsack Problem',
    category: 'dp',
    categoryName: 'Dynamic Programming',
    filePath: 'dynamic_programming/3_01_knapsack.cpp',
    timeComplexity: 'O(n * W)',
    spaceComplexity: 'O(n * W)',
    description: 'Solves the 0/1 Knapsack problem where items cannot be broken into fractions. Uses dynamic programming to compute the maximum value that fits within weight capacity W.',
    realWorld: ['Resource Allocation & Budgeting', 'Cargo Loading & Freight Optimization', 'Portfolio Financial Selection'],
    steps: [
      'Initialize 2D DP array dp[n+1][W+1] with zeros.',
      'For item i and weight w, if wt[i-1] <= w, option to include item: val[i-1] + dp[i-1][w-wt[i-1]].',
      'Compare with excluding item dp[i-1][w] and store max value.',
      'Backtrack from dp[n][W] to find chosen items.'
    ],
    pseudocode: [
      'for i = 1 to n:',
      '  for w = 0 to W:',
      '    if wt[i-1] <= w:',
      '      dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]])',
      '    else:',
      '      dp[i][w] = dp[i-1][w]'
    ],
    defaultInput: '3\n60 10\n100 20\n120 30\n50',
    code: `#include <iostream>
using namespace std;

int main() {
    int n, capacity;
    cout << "Enter number of items: ";
    cin >> n;

    int val[100], wt[100];
    cout << "Enter value and weight of each item:" << endl;
    for (int i = 0; i < n; i++) {
        cin >> val[i] >> wt[i];
    }

    cout << "Enter knapsack capacity: ";
    cin >> capacity;

    int dp[100][100] = {0};

    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            dp[i][w] = dp[i - 1][w];
            if (wt[i - 1] <= w) {
                int include = dp[i - 1][w - wt[i - 1]] + val[i - 1];
                if (include > dp[i][w])
                    dp[i][w] = include;
            }
        }
    }

    cout << "\\nDP Table:" << endl;
    cout << "Item\\\\Cap\\t";
    for (int w = 0; w <= capacity; w++)
        cout << w << "\\t";
    cout << endl;
    for (int i = 0; i <= n; i++) {
        cout << "Item " << i << "\\t\\t";
        for (int w = 0; w <= capacity; w++)
            cout << dp[i][w] << "\\t";
        cout << endl;
    }

    cout << "\\nMaximum value: " << dp[n][capacity] << endl;
    cout << "Items selected (1-indexed): ";
    int w = capacity;
    for (int i = n; i > 0; i--) {
        if (dp[i][w] != dp[i - 1][w]) {
            cout << i << " ";
            w -= wt[i - 1];
        }
    }
    cout << endl;

    return 0;
}
`
  },
  {
    id: 'floyd_warshall',
    name: 'Floyd-Warshall All-Pairs Shortest Path',
    category: 'dp',
    categoryName: 'Dynamic Programming',
    filePath: 'dynamic_programming/4_floyd_warshall.cpp',
    timeComplexity: 'O(V^3)',
    spaceComplexity: 'O(V^2)',
    description: 'Computes the shortest paths between all pairs of vertices in a directed weighted graph (allowing negative weights) and detects negative weight cycles.',
    realWorld: ['Flight & Transit Network All-Pairs Distance Tables', 'Transitive Closure in Graphs', 'Network Delay Matrix Computation'],
    steps: [
      'Initialize distance matrix dist[][] with direct edge weights and 0 on diagonal.',
      'Iterate through every intermediate vertex k from 0 to V-1.',
      'For each pair of vertices (i, j), check if dist[i][k] + dist[k][j] < dist[i][j].',
      'Update dist[i][j] with shorter path.',
      'If any dist[i][i] < 0 after completion, a negative cycle exists.'
    ],
    pseudocode: [
      'for k = 0 to V-1:',
      '  for i = 0 to V-1:',
      '    for j = 0 to V-1:',
      '      if dist[i][k] + dist[k][j] < dist[i][j]:',
      '        dist[i][j] = dist[i][k] + dist[k][j]'
    ],
    defaultInput: '4\n0 5 9999 10\n9999 0 3 9999\n9999 9999 0 1\n9999 9999 9999 0',
    code: `#include <iostream>
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

    for (int i = 0; i < n; i++)
        dist[i][i] = 0;

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

    bool negCycle = false;
    for (int i = 0; i < n; i++) {
        if (dist[i][i] < 0) {
            negCycle = true;
            break;
        }
    }

    if (negCycle) {
        cout << "\\nNegative weight cycle detected!" << endl;
        return 0;
    }

    cout << "\\nAll-Pairs Shortest Path Matrix:" << endl;
    cout << "\\t";
    for (int j = 0; j < n; j++)
        cout << j << "\\t";
    cout << endl;

    for (int i = 0; i < n; i++) {
        cout << i << "\\t";
        for (int j = 0; j < n; j++) {
            if (dist[i][j] == INF)
                cout << "INF\\t";
            else
                cout << dist[i][j] << "\\t";
        }
        cout << endl;
    }

    return 0;
}
`
  },
  {
    id: 'bellman_ford',
    name: 'Bellman-Ford Shortest Path',
    category: 'dp',
    categoryName: 'Dynamic Programming',
    filePath: 'dynamic_programming/5_bellman_ford.cpp',
    timeComplexity: 'O(V * E)',
    spaceComplexity: 'O(V)',
    description: 'Finds single-source shortest paths in graphs with negative edge weights and detects negative weight cycles by relaxing all edges V-1 times.',
    realWorld: ['Distance Vector Routing Protocols (RIP)', 'Financial Arbitrage Detection in Currency Exchange', 'Distributed Network Routing'],
    steps: [
      'Initialize distance to source as 0 and all other vertices as INF.',
      'Relax all E edges V-1 times: if dist[u] + w < dist[v], set dist[v] = dist[u] + w.',
      'Perform 1 extra relaxation step across all edges.',
      'If any distance shrinks in the V-th step, report a negative weight cycle.'
    ],
    pseudocode: [
      'dist[src] = 0, dist[others] = INF',
      'for step = 1 to V-1:',
      '  for each edge (u, v, w):',
      '    if dist[u] + w < dist[v]:',
      '      dist[v] = dist[u] + w',
      'for each edge (u, v, w):',
      '  if dist[u] + w < dist[v]: return "Negative Cycle"'
    ],
    defaultInput: '5 8\n0 1 -1\n0 2 4\n1 2 3\n1 3 2\n1 4 2\n3 2 5\n3 1 1\n4 3 -3\n0',
    code: `#include <iostream>
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
        cout << "\\nNegative weight cycle detected! Bellman-Ford cannot solve this." << endl;
        return 0;
    }

    cout << "\\nShortest distances from vertex " << src << ":" << endl;
    for (int i = 0; i < n; i++) {
        cout << "To " << i << " : ";
        if (dist[i] == INF)
            cout << "Not reachable" << endl;
        else
            cout << dist[i] << endl;
    }

    return 0;
}
`
  }
];
