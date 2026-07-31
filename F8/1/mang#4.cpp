/*Bài 3: Viết chương trình nhập vào 2 số nguyên dương n và m (0 < n <= 10, 0 < m <= 10). 
Tạo mảng 2 chiều chứa các số nguyên có n hàng và m cột. In ra màn hình các phần tử lớn nhất của các hàng.*/


#include<iostream>
using namespace std;

int main(){
    int n,m,arr[10][10];
    cout<<"n = ";
    cin >> n;
    cout<<"m = ";
    cin>>m;

    cout<<"nhap mang: "<< endl;
    for (int i = 0; i < n;i++){
        for(int j = 0; j < m;j++){
            cin>>arr[i][j];
        }
    }
    cout<<"cac phan tu lon nhat la: ";
    for (int i = 0; i < n; i++)
    {
        int max  = arr[i][0];
        for (int j = 0; j < m; j++){
            if (arr[i][j]>max){
                max = arr[i][j];
            }
    }
        cout << max << " ";
    }

}