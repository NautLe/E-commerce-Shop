//liet ke cac so chinh phuong nho hon n
/*Số chính phương là một số tự nhiên (số nguyên dương) mà căn bậc hai của nó là một số nguyên không âm. Đơn giản hơn, nó là số mà có thể được biểu diễn dưới dạng bình phương của một số nguyên.

Ví dụ, các số 1, 4, 9, 16, 25, 36, 49, ... là các số chính phương vì chúng có căn bậc hai là một số nguyên:

Căn bậc hai của 1 là √1 = 1.
Căn bậc hai của 4 là √4 = 2.
Căn bậc hai của 9 là √9 = 3.
Căn bậc hai của 16 là √16 = 4.
Và tiếp tục với các số chính phương tiếp theo.*/


#include <stdio.h>
#include<math.h>

int ktSCP(int x){
    int m = sqrt(x);
    if(m*m == x){
        return 1;
    }else{
        return 0;
    }

}

int main(){
    int n;
    do{
        printf("nhap vao so n= ");
        scanf("%d",&n);
    }while(n<=-1);
    for(int i=0;i<=n;i++){
        if(ktSCP(i)){
            printf("so chinh phuong la\n",i);
            printf("%d\n",i);
    }
}
}



