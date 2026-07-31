#include <stdio.h>


void sonhiphan(int x){
    if (x==0){
        return;
    }else{
        int r = (x%2);
        sonhiphan(x/2);
        printf("%d", r);
    }
 
}


int main(){
    int n;
    do{
        printf("nhap vao so nhi phan n= ");
        scanf("%d",&n);
    }while (n<0);
    printf("%d",sonhiphan);
    sonhiphan(n);
}