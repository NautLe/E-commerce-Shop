//viet phuong trinh nhap n (n<= 100). tinh va hien thi tong so tu nhien le tu 1 den n

#include <math.h>

#include <iostream>

int main(){
    int n;
    std::cout<<"nhap n= ";
    std::cin>>n;
    int s =0;
    for(int i=1;i<=n;i++){
        if(i%2==1){
            s+=i;
        }
    }
    std::cout<<s;
    return 0;

}