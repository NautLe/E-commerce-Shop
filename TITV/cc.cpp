#include <stdio.h>

int main(){
	int a,b,min,max;
	printf("nhap vao a =");
	scanf("%d",&a);
	printf("nhap vao b = ");
	scanf("%d",&b);
	
	min = (a<b)?a:b;
	max = (a>b)?a:b;
	printf("\n max = %d",max);
	printf("\n min = %d",min);
return 0;

}



