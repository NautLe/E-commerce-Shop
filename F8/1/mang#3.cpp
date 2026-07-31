/* Bài 2: Viết chương trình nhập vào số nguyên dương n (0 < n <= 10). 
Tạo mảng 1 chiều có n phần tử là số nguyên và in ra màn hình phần tử có giá trị lớn nhất.
*/

#include<iostream>
using namespace std;

int main(){
    int n,arr[10];
    cout<<"n = ";
    cin>>n;

    cout<<"nhap mang: ";
    for(int i = 0; i<n;i++){ 
            cin>>arr[i];
    }
    int max=0;
    for(int i = 0; i<n;i++){
            if(arr[i]>max)
            {
                max=arr[i]; 
            }
    }
cout<<"gia tri lon nhat la: "<<max;
}