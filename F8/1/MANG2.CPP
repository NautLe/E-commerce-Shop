//2. tao mang so nguyen duong co n phan tu (toi da 10 phan tu). Nhap vao 1 so nguyen duong x (0<=x<=9) va xoa phan tu o vi tri x

#include <iostream>
using namespace std;

int main(){
    int x,n,numbers[20];
    cout<<"Nhap n = ";
    cin>>n;
    cout<<"nhap mang: ";
    for(int i=0;i<n;i++){
        cin>>numbers[i];
}
    cout<<"nhap x = ";
    cin>>x;

    for(int i=x;i<n-2;i++){
        numbers[i]= numbers[i+1];
}
n--;
cout<<"mang sau khi xoa: ";
for(int i=0;i<n;i++){
    cout<<numbers[i]<<" ";
}
}