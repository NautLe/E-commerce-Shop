#include <stdio.h>
#include <math.h>

    //A(xa,ya)
    //B(xb,yb)
    //C(xc,yc)
int main(){
    float AB,BC,AC;
    float xa,ya,xb,yb,xc,yc;
    float chuvi,dientich,p,s;
    printf("moi nhap vao man hinh toa do dinh A = ");
    scanf("%f%f",&xa,&ya);
    printf("moi nhap vao man hinh toa do dinh B = ");
    scanf("%f%f",&xb,&yb);
    printf("moi nhap vao man hinh toa do dinh C = ");
    scanf("%f%f",&xc,&yc);

    BC=sqrt(pow(xb-xc,2) + pow(yb-yc,2));
    AC=sqrt(pow(xa-xc,2) + pow(ya-yc,2));
    AB=sqrt(pow(xa-xb,2) + pow(ya-yb,2));

    printf("\n AB=%.2f,BC=%.2f,AC=%.2f,AB=%.2f",AB,AC,BC);

    chuvi=(AB+BC+AC);
    printf("\n chu vi tam giac abc la: %.2f",chuvi);
    p=chuvi/2;
    dientich=sqrt(p*(p-AB)*(p-BC)*(p-AC));
    printf("\n dien tich tam giac abc la: %.2f",dientich);

    if (AB+BC>AC && AB+AC>BC && BC+AC>AB){
        printf("\nABC TAO THANH TAM GIAC");
    
        if(AB==BC || AB==AC || BC==AC){
        printf("\nday la tam giac can");
        }else{
        printf("\nday la tam giac khong can");
    }
    
    }else{
        printf("\nABC ko phai la tam giac ");
    }
}
    
