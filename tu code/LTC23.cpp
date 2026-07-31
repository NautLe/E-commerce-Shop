//tim uoc so chung lon nhat cua a va b
#include<stdio.h>
int main(){
    int a,b;
    printf("nhap a= ");
    scanf("%d",&a);
    printf("nhap b= ");
    scanf("%d",&b);
    if(a==0||b==0){
        printf("USCLN la: %d\n",(a+b));
        
    }else if(a!=0 && b!=0){
        if(a>b){
            printf("USCLN la: %d\n",(a-b));
        }
        else{
            printf("USCLN la: %d\n",(b-a));
        }
}   
    else{
        printf("nhap sai gia tri vui long nhap lai");
    }
}