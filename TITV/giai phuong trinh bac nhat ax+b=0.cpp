#include <stdio.h>

int main(){
	
	float a,b,x;
	printf("nhap vao he phuong trinh ax + b= 0");
	printf("nhap vao a= %f",a);
	scanf("%f",&a);
	printf("nhap vao b= %f",b);
	scanf("%f",&b);
	
	
	//xuat du lieu ra man hinh
	x = -b/a;
	printf("x = %.2f",x);
}
