//tinh giai thua so n duoc nhap tu ban phim

#include<stdio.h>

int main()
{
    int a=1,n;
    printf("Nhap so n: ");
    scanf("%d", &n);
    for(int i=1; i<=n; i++){
        a*=i;
    }
    printf("so giai thua cua n la: %d \n", a);      
}