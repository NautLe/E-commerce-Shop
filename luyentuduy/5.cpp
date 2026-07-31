//5. S=1+1/3+1/5...+1/2n+1

#include <stdio.h>
#include <math.h>
#include <iostream>
using namespace std;
int main(){
    float s = 1.0,i,n;
    printf("Nhap n= ");
    scanf("%f",&n);
    for(i=1;i<=n;i=i+1){
        s = s + (1.0/(2*i+1));
    
}
    cout<<s<<endl;
}   