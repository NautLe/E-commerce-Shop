/* Bài 4: Viết chương trình nhập vào 1 ma trận có n hàng và m cột (0 < n <= 10, 0 < m <= 10). 
In ra màn hình tổng của các số lẻ xuất hiện trong ma trận. */

#include<iostream>
using namespace std;

int main(){
    int n,m,array[10][10];
    cout<<"Nhap n = ";
    cin>>n;

    cout<<"Nhap m = ";
    cin>>m;

    cout<<"nhap ma tran: "<<endl;
    for(int i=0;i<n;i++){
        for(int j=0;j<m;j++){
           cin>>array[i][j];
    }
}
int s = 0;
    for(int i = 0;i<n;i++){
        for(int j = 0;j<m;j++){
            if(array[i][j]%2==1){
                s = s+array[i][j];
}
}
}
cout<<"Tong cac so le la: "<<s<<endl;
}