#include <iostream>
using namespace std;

int main() {
    int n, capacity;
    cout << "Enter number of items: ";
    cin >> n;

    int val[100], wt[100];
    double ratio[100];

    cout << "Enter value and weight of each item:" << endl;
    for (int i = 0; i < n; i++) {
        cin >> val[i] >> wt[i];
        ratio[i] = (double)val[i] / wt[i];
    }

    cout << "Enter knapsack capacity: ";
    cin >> capacity;

    for (int i = 0; i < n - 1; i++) {
        for (int j = i + 1; j < n; j++) {
            if (ratio[i] < ratio[j]) {
                swap(ratio[i], ratio[j]);
                swap(val[i], val[j]);
                swap(wt[i], wt[j]);
            }
        }
    }

    double maxProfit = 0;

    for (int i = 0; i < n; i++) {
        if (wt[i] <= capacity) {
            capacity -= wt[i];
            maxProfit += val[i];
        } else {
            maxProfit += val[i] * ((double)capacity / wt[i]);
            break;
        }
    }

    cout << "Maximum value: " << maxProfit << endl;

    return 0;
}
