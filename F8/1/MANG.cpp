// 1. tao mang so nguyen duong co n phan tu (toi da 10 phan tu). nhap vao so nguyen duong x va them x vao cuoi mang vua tao
#include<iostream>
using namespace std;

int main(){
    int numbers[20];
    int x,n;
    cout<<"nhap n= ";
    cin>>n;
    for(int i = 0; i < n; i++){
        cin>>numbers[i];
    }

    cout<<"Nhap x =";
    cin>>x;

    numbers[n] = x;
    n++;

    cout<<"mang sau khi them: ";
    for(int i = 0; i < n; i++){
        cout<<numbers[i];
    }
}