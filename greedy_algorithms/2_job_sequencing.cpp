#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Enter number of jobs: ";
    cin >> n;

    int id[100], deadline[100], profit[100];

    cout << "Enter deadline and profit for each job:" << endl;
    for (int i = 0; i < n; i++) {
        id[i] = i + 1;
        cin >> deadline[i] >> profit[i];
    }

    for (int i = 0; i < n - 1; i++) {
        for (int j = i + 1; j < n; j++) {
            if (profit[i] < profit[j]) {
                swap(profit[i], profit[j]);
                swap(deadline[i], deadline[j]);
                swap(id[i], id[j]);
            }
        }
    }

    int maxDeadline = 0;
    for (int i = 0; i < n; i++) {
        if (deadline[i] > maxDeadline) {
            maxDeadline = deadline[i];
        }
    }

    int slot[100] = {0};
    bool filled[100] = {false};

    int totalProfit = 0, count = 0;

    for (int i = 0; i < n; i++) {
        for (int j = deadline[i]; j > 0; j--) {
            if (!filled[j]) {
                filled[j] = true;
                slot[j] = id[i];
                totalProfit += profit[i];
                count++;
                break;
            }
        }
    }

    cout << "Number of jobs done: " << count << endl;
    cout << "Maximum profit: " << totalProfit << endl;
    cout << "Scheduled jobs: ";
    for (int i = 1; i <= maxDeadline; i++) {
        if (filled[i]) {
            cout << "J" << slot[i] << " ";
        }
    }
    cout << endl;

    return 0;
}
