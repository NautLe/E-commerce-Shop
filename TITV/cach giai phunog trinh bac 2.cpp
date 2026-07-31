//Giai phuong trinh bac 2 ax^2+bx+c=0
#include"stdio.h"
#include"math.h"
//Khai bao
int main(){
	float a,b,c,x1,x2,delta;
//Nhap lieu
printf("\nnhap phuong trinh ax^2+bx+c = 0");
printf("\nnhap a = ");
scanf("%f",&a);
printf("\nnhap b = ");
scanf("%f",&b);
printf("\nnhap c = ");
scanf("%f",&c);

//Tinh toan va xuat ket qua
if(a==0){
	printf("he so a phai khac 0");
	
}else{
	//a!=0
	delta = pow(b,2)-4*a*c;
	
	if (delta>0){
		printf("phuong trinhn co 2 nghiem pb");
		x1=(-b+sqrt(delta))/2*a;
		x2=(-b-sqrt(delta))/2*a;
		printf("\n %.2f",x1);
		printf("\n %.2f",x2);
	}else if (delta==0){
		x1 = -b/(2*a);
			printf("phuong trinh co nghiem kep x1=x2=%.2f ",x1);
		
	}else{
		printf("\nphuong trinh vo nghiem");
	}

	}
}
