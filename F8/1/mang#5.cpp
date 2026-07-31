/*Bài 4: Viết chương trình nhập vào 2 số nguyên dương n và m (2 <= n <= 10, 2 <= m <= 10). 
Tạo mảng 2 chiều chứa các số nguyên có n hàng và m cột. Tính tổng các giá trị biên của mảng vừa tạo.*/

#include <iostream>
using namespace std;

int main(){
    int n,m,arr[10][10];
    cout<<"nhap n = ";
    cin>>n;
    cout<<"nhap m = ";
    cin>>m;
    cout<<"nhap mang = ";

    for(int i=0;i<n;i++){
        for (int j = 0;j<m;j++){
            cin>>arr[i][j];

}
}
    int sum = 0;
    for(int i=0;i<n;i++){
        for(int j=0;j<m;j++){
            if(i == 0||j==0||i==n-1||j==m-1){
                sum+=arr[i][j];
            }
            
}
}
cout<<"Tong cac gia tri bien la: "<<sum<<endl;
}