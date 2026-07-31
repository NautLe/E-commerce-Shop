#include <stdio.h>

int giaithua(int x){
    if (x==0 || x==1) 
    return 1;
    else{
    return x*giaithua(x-1);
}

}
int main(){
    int n;
    printf("nhap n: ");
    scanf("%d",&n);
    printf("%d!= %d",n,giaithua(n));
    
}