//7. S = 1/2 + 2/3 + 3/4 + ... + n/n+1

#include <stdio.h>
#include <math.h>
#include <iostream>
using namespace std;
int main(){
    float s = 0,i,n;
    printf("Nhap n= ");
    scanf("%f",&n);
    for(i=1;i<=n;i=i+1){
        s = s + i/(i+1);
    
}
    cout<<s<<endl;
}   