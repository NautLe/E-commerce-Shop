#include<stdio.h>
int main(){
    int c;
    do{
        printf("\n------------------------");
        printf("\nMENU:");
        printf("\nNhap so 0 de ket thuc chuong trinh");
        printf("\nNhap vao so bat ki khac 0 de tiep tuc: ");
        scanf("%d", &c);
        printf("%d", c);
    }while(c != 0);
}
