//bai tap giai phuong trinh bac 2

#include<stdio.h>
#include<math.h>

int main(){
    float a,b,c,x1,x2;
    printf("nhap a= ");
    scanf("%f",&a);
    printf("nhap b= ");
    scanf("%f",&b);
    printf("nhap c= ");
    scanf("%f",&c);
    int delta=pow(b,2)-4*a*c;
    if(a==0){
        printf("he so a phai khac 0");
    }
    if(delta>0){
        printf("pt co 2 nghiem pb");
        x1=(-b+sqrt(delta))/2*a;
        x2=(-b-sqrt(delta))/2*a;
        printf(" x1=%.2f, x2=%.2f",x1,x2);
    }else if(delta==0){
        x1=-b/(2*a);
        printf("pt co 1 nghiem");
        printf(" x1=x2= %.2f",x1);
    }else{
        printf("pt vo nghiem");
    }

}