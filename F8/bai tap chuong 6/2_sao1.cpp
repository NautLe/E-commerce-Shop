/*Bài 2: Viết chương trình nhập vào 1 số nguyên dương n (n > 1). Tính và in ra màn hình tổng các số nguyên tố từ 2 -> n.
Lưu ý: Làm bằng 2 cách (sử dụng vòng lặp, sử dụng đệ quy)

Ví dụ:

n = 10

n = 2 + 3 + 4 + 5 + 6+ 7+ 8 + 9
Ket qua: 17 */

#include<math.h>
#include<iostream>
#include<string>
using namespace std;

void kiem_tra_n(string label, int &n){
    cout<<label;
    cin>>n;
}
bool is_prime(int n){
    for (int i = 2 ; i<=sqrt(n) ; i++){
        if (n % i == 0){            
            return false;
}
    }
    return true;
}
int sum_of_prime(int n){
    if ( n == 2 ){
        return 2;
    }
    if(is_prime(n))
    {
        return n + sum_of_prime(n-1);
    }
    return sum_of_prime(n-1);
}

int main(){
    int n;
    kiem_tra_n(" n = ", n);
    cout<<"ket qua: "<< sum_of_prime(n);
}