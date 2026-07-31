//viet chuong trinh tim so ngay trong thang, ngay ke tiep, ngay truoc do, ngay thu bao nhieu trong nam


// Xin luu y: doan code da bo sung phan kiem tra ngay nhap co chinh xac hay khong?

#include "stdio.h"


int songaycuathang(int thang,int nam){
	switch(thang){
		case 1:
		case 3:
		case 5:
		case 7:
		case 8:
		case 10:
		case 12:
			return 31;
		case 4:
		case 6:
		case 9:
		case 11:
			return 30;
		case 2:{
			return ((nam%400==0||(nam%4==0&&nam%100!=0)))?29:28;
		default:
			return -1;
				
	}
	}
}

int ngaytrongnam(int ngay,int thang, int nam){
	int ntn = 0;
	for(int i =1; i < thang,nam)
}

int main(){
	int ngay,thang,nam;
	do{
		printf("nhap vao ngay: ");
		scanf("%d",&ngay);
		printf("nhap vao thang: ");
		scanf("%d",&thang);
		printf("nhap vao nam: ");
		scanf("%d",&nam);
	}while((ngay > songaycuathang(thang, nam)));

	//  tim so ngay trong thang
	printf("\nso ngay trong thang la: %d",songaycuathang(thang,nam));
}



