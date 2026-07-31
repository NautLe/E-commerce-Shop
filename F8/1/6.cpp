/*/Bài 5: Viết chương trình nhập vào một số nguyên dương n từ bàn phím. Tính tổng các chữ số tạo nên số đó.
Ví dụ:

n = 2023
Ket qua la 7 */

#include<iostream>
#include<math.h>
using namespace std;

int main(){
    int n,s=0;
    cout<<"nhap n= ";
    cin>>n;
    while(n>0){
        s=s+(n%10);
        n=n/10;

    }
    cout<<s;
}
