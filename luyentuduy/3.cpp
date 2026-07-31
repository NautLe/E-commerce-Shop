//3. 1+1/2+1/3+...+1/n

#include <stdio.h>
#include <math.h>
#include <iostream>
using namespace std;
int main(){
    float s = 0,i,n;
    printf("Nhap n= ");
    scanf("%f",&n);
    for(i=1;i<=n;i++){
        s = s + (1/i);
}
    cout<<s<<endl;
}   


