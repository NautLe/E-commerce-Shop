/*Bài 1: Viết chương trình nhập vào 2 số nguyên dương n và m (0 < n <= 10, 0 < m <= 10). 
Tạo mảng 2 chiều chứa các số nguyên có n hàng và m cột. Tính và in ra màn hình tổng các phần tử có trong mảng.
*/

#include<stdio.h>
#include<math.h>
#include<iostream>
using namespace std;



int main (){
int m,n,s=0,arr[10][10]; ;
  


cout<<"nhap n= ";
cin>>n;
cout<<"nhap m = ";
cin>>m;

    for(int i = 0; i<n;i++){
        for(int j = 0; j<m;j++){
            cout<<"arr["<<i<<"][" <<j<< "] = ";
            cin>>arr[i][j];

        }

    }
    for(int i = 0; i<n;i++){
        for(int j = 0; j<m;j++){
            s=s+arr[i][j];
        }
    }
    cout<<"tong cac phan tu trong mang la: "<<s;
}

