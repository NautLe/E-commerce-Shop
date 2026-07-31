//su dung lenh goto va continue de nhap vao so n  va xuat ra man hinh cac so le tu 1 den n

#include <stdio.h>

int main(){
    int n;
    Nhap:
    printf("nhap vao 1 so n: ");
    scanf("%d",&n);
    if(n<=0) goto Nhap;

    printf("so le la: ");
    for (int i=1; i<=n; i++){
        if(i%2==0) continue; 
        printf("%d ",i);
    }
}