// TINH S=1+2+3+...+n
#include<stdio.h>

int main(){
    int sum=0,i,n;
    printf("nhap n= ");
    scanf("%d",&n);
    for(i=0;i<=n;i++){
        sum+=i;
    }
printf("S= %d\n",sum);
}

