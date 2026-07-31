// bai tap tinh dien tich chu vi va tam giac trong lap trinh

#include <stdio.h>
#include <math.h>

int main(){
    float AB,AC,BC,chuvi,p;
    float xa,xb,xc,dientich;
    float ya,yb,yc;

    printf("Nhap a= ",xa,ya);
    scanf("%f%f",&xa,&ya);
    printf("Nhap b= ",xb,yb);
    scanf("%f%f",&xb,&yb);
    printf("Nhap c= ",xc,yc);
    scanf("%f%f",&xc,&yc);

    AB=sqrt(pow(xa-xb,2) + pow(ya-yb,2));
    AC=sqrt(pow(xa-xc,2)+ pow(ya-yc,2));
    BC=sqrt(pow(xb-xc,2) + pow(yb-yc,2));

    printf("\nAB=%.2f,AC=%.2f,BC=%.2f",AB,AC,BC);

    if(AB+AC>BC && AC + BC>AB && AB+BC>AC){
        printf("\nABC tao thanh 1 tam giac");
        if(AB==AC || AC==BC || AB==BC){
            printf("\nABC tao thanh 1 tam giac can");
        }else{ 
            printf("\nABC ko tao thanh 1 tam giac can");
        }
        chuvi = AB+AC+BC;
        printf("\nchuvi: %.2f ",chuvi);
        p=chuvi/2;
        dientich=sqrt(p*(p-AB)*(p-AC)*(p-BC));
        printf("\ndien tich tam giac ABC la: %.2f ", dientich);


}else{
    printf("\nABC KO TAO THANH TAM GIAC");
}
}