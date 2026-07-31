#include<stdio.h>

int main(){
    int a=0,n,sum=0;
    printf("moi ban nhap 1 so: ");
    scanf("%d", &n);
    while(a<=n){
        sum =sum + a;
        ++a;                                                                  
    }
    printf("%d", sum);
}   

// lap lan 1 : a = 1, sum = 0
// lap lan 2 : a = 2, sum = 3

