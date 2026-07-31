/*
Bài 3: Viết chương trình nhập vào 2 ma trận có n hàng và m cột (0 < n <= 10, 0 < m <= 10). In ra tổng của 2 ma trận.*/
#include <iostream>
using namespace std;

int main(){
    int n,m,array1[10][10],array2[10][10];

    cout<<"n = ";
    cin>>n;
    cout<<"m = ";
    cin>>m;
    
    cout<<"Nhap ma tran 1: "<<endl;
    
    for(int i=0;i<n;i++){
        for(int j=0;j<m;j++){
            cin>>array1[i][j];
        }
    }

    cout<<"Nhap ma tran 2: "<<endl;

    for(int i=0;i<n;i++){
        for(int j=0;j<m;j++){
            cin>>array2[i][j];
        }
    }
    cout<<"tong 2 ma tran la: "<<endl;
    for(int i=0;i<n;i++){
        for(int j=0;j<m;j++){
            cout<<array1[i][j]+array2[i][j]<<" ";
        }
        cout<<endl;
    }

 

}