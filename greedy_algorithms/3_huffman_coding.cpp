#include <iostream>
#include <string>
using namespace std;

char ch[200];
int freq[200];
int parent[200];
bool isLeft[200];
int total;

int findMin(int skip) {
    int minIdx = -1;
    for (int i = 0; i < total; i++) {
        if (i == skip) continue;
        if (parent[i] != -1) continue;
        if (minIdx == -1 || freq[i] < freq[minIdx]) {
            minIdx = i;
        }
    }
    return minIdx;
}

void printCode(int idx, string code) {
    if (idx < 0) return;

    if (ch[idx] != '$') {
        cout << ch[idx] << ": " << code << endl;
        return;
    }

    for (int i = 0; i < total; i++) {
        if (parent[i] == idx && isLeft[i]) {
            printCode(i, code + "0");
        }
        if (parent[i] == idx && !isLeft[i]) {
            printCode(i, code + "1");
        }
    }
}

int main() {
    int n;
    cout << "Enter number of characters: ";
    cin >> n;

    total = n;

    cout << "Enter character and frequency pairs:" << endl;
    for (int i = 0; i < n; i++) {
        cin >> ch[i] >> freq[i];
        parent[i] = -1;
    }

    int remaining = n;

    while (remaining > 1) {
        int i1 = findMin(-1);
        int i2 = findMin(i1);

        ch[total] = '$';
        freq[total] = freq[i1] + freq[i2];
        parent[total] = -1;

        parent[i1] = total;
        isLeft[i1] = true;

        parent[i2] = total;
        isLeft[i2] = false;

        total++;
        remaining--;
    }

    cout << "Huffman Codes:" << endl;
    printCode(total - 1, "");

    return 0;
}
