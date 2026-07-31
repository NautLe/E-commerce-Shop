//tim so lon nhat tim so nho nhat

#include<stdio.h>

int main(){
    int a,b;
    printf("moi ban nhap a: ");
    scanf("%d",&a);
    printf("moi ban nhap b: ");
    scanf("%d",&b);    
    if(a>b){
        printf("%d la so lon nhat",a);
    }else if(a<b){
        printf("%d la so nho nhat",a);
    }
    else{
        printf("2 so deu bang nhau");
    }
}