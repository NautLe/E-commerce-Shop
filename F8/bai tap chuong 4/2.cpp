#include <iostream>
using namespace std;

int main() {
    int n, k, array[20];
    cout << "nhap n= ";
    cin >> n;
    cout << "nhap mang = ";
    for (int i = 0; i < n; i++) {
        cin >> array[i];
    }
    cout << "nhap k= ";
    cin >> k;

    bool found = false; // Biến kiểm tra kết quả hợp lệ

    cout << "ket qua la : ";
    for (int i = n - 1; i > 0; i--) {
        for (int j = 0; j < i; j++) {
            if (array[j] + array[i] == k) {
                cout << j << " " << i << " ";
                found = true; // Đánh dấu đã tìm thấy kết quả hợp lệ
            }
        }
    }

    if (!found) {
        cout << "Khong co ket qua hop le.";
    }

    return 0;
}