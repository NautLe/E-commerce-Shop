// IN RA SO NGAY TRONG THANG DUNG SWITCH CASE

#include "stdio.h"

int main(){
	int months,years;
	printf("Vui long nhap thang = ");
	scanf("%d",&months);
	printf("Vui long nhap nam = ");
	scanf("%d",&years);
	
	switch (months){
		case 1:
		case 3:
		case 5:
		case 7:
		case 8:
		case 10:
		case 12:
			printf("co 31 ngay");
			break;
		case 4:
		case 6:
		case 9:
		case 11:
			printf("co 30 ngay");
			break;
			
		case 2:
			if (years %400 == 0 || (years % 4 == 0 && years != 100)){
				printf("la nam nhuan co 29 ngay");
			}else{
				printf("co 28 ngay");
			}
			break;		
			
		default:
			printf("___________ ");
			printf("ban nhap sai cu phap!!");
			printf(" __________");
			}
		
	}

