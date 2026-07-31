//Bài 1: Viết chương trình nhập vào 1 số nguyên dương n. Kiểm tra xem số n có phải là số nguyên tố hay không
#include<math.h>
#include<iostream>
#include<string>

using namespace std;
void input_integer(string label, int &n){
	cout<<label;
	cin>>n;
}
bool is_Prime(int n);
int main(){
    int n;
    input_integer("n = ",n);
    if (is_Prime(n)) {
        cout<<n<<" la so nguyen to";
    }
    else{
        cout<<n<<" khong phai la so nguyen to";
    }
}

bool is_Prime(int n){
    if (n<2){
        return false;
    }
    for(int i = 2 ; i <= sqrt(n); i++){
        if (n%i == 0){
            return false;
        }
    }
    return true;
}

