//1. S = 1+3+5+...+(2n+1)
#include <stdio.h>
#include <math.h>
#include <iostream>
using namespace std;
int main(){
    int s = 0,i,n;
    cout<<"nhap n= ";
    cin>>n;
    for(i=1;i<=(2*n)+1;i=i+2){
        s = s + i;
    
}
    cout<<s<<endl;
}   