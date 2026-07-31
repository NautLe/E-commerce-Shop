#include "stdio.h"

int main(){
	int a,b,c,p;
	printf("nhap vao ba canh cua tam giac a,b,c");
	scanf( %d%d%d,&a,&b,&c);
	if(a+b<c||a+c<b||b+c<a){
		printf("day ko phai la tam giac");
	}else if(a+b>c||a+c>b||b+c>a){
		printf("day la mot tam giac");
	}else if(c=b&&c=a||a=b&&a=c){
		printf("day la mot tam giac can");
	}else{
		printf("Ban nhap sai cu phap!!");
	}
	
	p=a+b+c;
	printf("chu vi tam giac ABC = %f",p);
	
		
	
}
