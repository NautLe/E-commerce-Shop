//bai tap giai phuong trinh bac nhat

#include<stdio.h>

int main(){
    float a,b,x;
    printf("nhap a: ");
    scanf("%f",&a);
    printf("nhap b: ");
    scanf("%f",&b);

    x=-b/a;
   
   if(a==0||b==0){
        printf("\nban nhap sai cu phap!! ");
    
}return 0;
printf("x=%.2f",x);

}