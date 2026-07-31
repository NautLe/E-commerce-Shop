/*Bài 1: Viết chương trình nhập vào 1 chuỗi gồm các ký tự từ a -> z và có thể chứa khoảng trắng. 
Hãy loại bỏ các khoảng trắng ở đầu và cuối chuỗi.*/

#include <string>
#include <iostream>

using namespace std;


int main(){
    string str;

    cout<<"nhap chuoi: ";

    getline(cin,str);

 // xoa khoang trang o dau chuoi
    while (str[0]==' '){
        str.erase(0,1);
    }
// xoa khoang trang o cuoi chuoi
while(str[str.length() - 1] == ' '){
    str.erase(str.length() - 1, 1);
}

    cout << "Chuoi vua nhap: " << str << "h";
    
    
    
}