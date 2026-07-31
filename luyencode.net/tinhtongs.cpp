#include <stdio.h>

int main(){
    int sum=0,n;
    printf("so nguyen duong n: ");
    scanf("%d",&n);
    for(int i = 1;i<=n;i++){
        sum=sum+i;
    }
    printf("%d\n",sum);
}


//n = 3 
//i = 1=> sum = 0 + 1 = 1   
//i = 2=> sum = 1 + 2 = 3
//i = 3=> sum = 3 + 3 = 6