//nhap 2 so nguyen a,b tim uoc so chung lon nhat roi in ra man hinh

#include<stdio.h>

int main(){
    int a,b,USCLN;
    printf("nhap vao so a: ");
    scanf("%d",&a);
    printf("nhap vao so b: ");
    scanf("%d",&b);
    if(a==0||b==0){
        USCLN = (a+b);
    }
    while (a!=b){
        if (a>b){
            a=a-b;
        }if(a<b){
            b=b-a;
        }else{
            USCLN = a;
        }
    }
    USCLN =a;
 printf("USCLN= %d ",USCLN);
}
