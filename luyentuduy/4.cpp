//4. 1/2+1/4+...1/2n


#include <stdio.h>
#include <math.h>
#include <iostream>
using namespace std;
int main(){
    float s = 0,i,n;
    printf("Nhap n= ");
    scanf("%f",&n);
    for(i=1;i<=n;i=i+1){
        s = s + 1.0/(2*i);
    
}
    cout<<s<<endl;
}   
// s= 0 => i = 0.5=> n= 2 => 0.5<=2 (T)

