//Bài 1: Nhập 1 số nguyên dương n. In ra màn hình giá trị của S = 1 + 2 + 3 + ... + n.

//Bài 2: Nhập 1 số nguyên dương n. In ra màn hình giá trị của S = 1^2 + 2^2 + 3^2 + ... + n^2.

//Bài 3: Nhập 1 số nguyên dương n. In ra màn hình giai thừa n!.

//Bài 4: Nhập vào 1 số nguyên dương n. In ra màn hình các số chia hết cho 5 từ 1 đến n.

#include <stdio.h>
#include <math.h>
#include <iostream>

using namespace std;
int main(){
    int s = 5,i,n;
    cout<<"nhap n= ";
    cin>>n;
    for(i=1;i<=n;i=i+1){
        if (i%5==0){
            cout<<i<<" ";
        }

    }               
}
        
        
 

