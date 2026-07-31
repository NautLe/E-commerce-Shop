//8. S = 1/2+3/4+5/6+...+2n+1/2n+2

#include <stdio.h>
#include <math.h>
#include <iostream>
using namespace std;
int main(){
    float s = 1.0/2,i,n;
    printf("Nhap n= ");
    scanf("%f",&n);
    for(i=1;i<=n;i=i+1){
        s = s + ((2*i+1)/(2*i+2));
    
}
    cout<<s<<endl;
}   