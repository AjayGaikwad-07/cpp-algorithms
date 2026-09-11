#include <iostream>
using namespace std;

int findMin(int files[], int n) {
    int minIndex = 0;
    for (int i = 1; i < n; i++) {
        if (files[i] < files[minIndex]) {
            minIndex = i;
        }
    }
    return minIndex;
}

int main() {
    int n;
    cout << "Enter number of files: ";
    cin >> n;

    int files[100];
    cout << "Enter size of each file: ";
    for (int i = 0; i < n; i++) {
        cin >> files[i];
    }

    int totalCost = 0;
    int size = n;

    while (size > 1) {
        int i1 = findMin(files, size);
        int min1 = files[i1];
        files[i1] = files[size - 1];
        size--;

        int i2 = findMin(files, size);
        int min2 = files[i2];

        int merged = min1 + min2;
        totalCost += merged;

        files[i2] = merged;
    }

    cout << "Minimum merge cost: " << totalCost << endl;

    return 0;
}
