//8. T= 1*2*3*...*n

#include <stdio.h>
#include <math.h>
#include <iostream>
using namespace std;
int main(){
    float s = 1,i,n;
    printf("Nhap n= ");
    scanf("%f",&n);
    for(i=1;i<=n;i=i+1){
        s = s * i;
    
}
    cout<<s<<endl;
}   