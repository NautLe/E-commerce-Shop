/* Bài 3: Viết chương trình nhập vào 1 số nguyên dương n. Tính và in ra màn hình n!.
Lưu ý: Làm bằng 2 cách (sử dụng vòng lặp, sử dụng đệ quy)

Ví dụ:

n = 3
3! = 6*/

#include<iostream>
#include<math.h>
#include<string>
using namespace std;

void nhap_n(string label, int &n){
    cout<<label;
    cin>>n;
}

long long calculate_factorial(int n){
    int factorial = 1;
    for(int i = 1 ; i<=n; i++){
        factorial *= i;  
    }
    return factorial;
}


int main(){
    int n;
    nhap_n("n = ", n);
    cout<<calculate_factorial(n);

}