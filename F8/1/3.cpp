// giai phuong trinh bac nhat mot an

#include <stdio.h>
#include<iostream>
#include<math.h>


int main(){
    float a,b;
    std::cout<<"a= ";
    std::cin>>a;
    std::cout<<"b= ";
    std::cin>>b;
if (a==0 && b==0){
    std::cout<<"phuong trinh co vo so nghiem";
}
else if(a==0 && b!=0){
    std::cout<<"phuong trinh vo nghiem";
}else if(a!=0){
    std::cout<<"phuong trinh co nghiem duy nhat"<<-b/a;

}else{
    std::cout<<"sai cu phap";
}


}