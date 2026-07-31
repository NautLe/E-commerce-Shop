//BAI TAP TIM SO NGAY CUA THANG

#include<stdio.h>

int main(){
    int ngay,thang,nam;
    printf("nhap thang: ");
    scanf("%d",&thang);
    printf("nhap nam: ");
    scanf("%d",&nam);
    switch(thang){
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
            if((nam%400==0)||(nam%4==0&&nam%100!=0)){
                printf("day la nam nhuan nen thang 2 co 29 ngay");
            }else{
                printf("day la nam ko nhuan nen thang 2 co 28 ngay");
                break;
            }
        default:
            printf("nhap du lieu ko dung");


            
    }
}