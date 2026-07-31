//Xuất ra tất cả các số nguyên tố nhỏ hơn bằng n 


#include<stdio.h>
#include<math.h>

int kiemtrasonguyento(int x){
    for (int i=2;i<=sqrt(x);i++){
        if(x%i==0){
            return 0;
        }else{
            return 1;
        }

}
}

int main(){
    int n;
    do{
        printf("nhap n= ");
        scanf("%d",&n); 
    }while(n<1);

    for(int j=2;j<=n;j++)
    {
        if(kiemtrasonguyento(j)){
            printf("%d\n",j);
        }
    }
}