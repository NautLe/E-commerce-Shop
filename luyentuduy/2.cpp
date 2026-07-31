//2. S= 1^2+2^2+3^2+...+n^2

#include <stdio.h>
#include <math.h>
#include <iostream>
using namespace std;
int main(){
    int s = 0,i,n;
    cout<<"nhap n= ";
    cin>>n;
    for(i=1;i<=n;i=i+1){
        s = s + (i*i);
}
    cout<<s<<endl;
}   


