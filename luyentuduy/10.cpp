//10. S=1^3+2^3+...+n^3


#include <stdio.h>
#include <math.h>
#include <iostream>
using namespace std;
int main(){
    float s = 0,i,n;
    printf("Nhap n= ");
    scanf("%f",&n);
    for(i=1;i<=n;i=i+1){
        s = s + pow(i,3);
    
}
    cout<<s<<endl;
}   