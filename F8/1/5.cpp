//Bài 4: Viết chương trình nhập vào một số n từ bàn phím. Hãy kiểm tra xem n có phải số nguyên tố hay không.


#include<iostream>
#include<math.h>
using namespace std;

int main(){
    int i,n;
    cout<<"nhap n= ";
    cin>>n;    

    for(i=2;i<=sqrt(n);i++){
        if(n%i==0){
            cout<<n<<" ko phai la so nguyen to";
            break;
        }
    }
if(n%i!=0)
    cout<<n<<" la so nguyen to";
       
}
                                                                                                                                                                                                                                                                