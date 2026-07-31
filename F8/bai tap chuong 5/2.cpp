/*Bài 2: Viết chương trình nhập vào 1 chuỗi gồm các ký tự a -> z và có thể chứa khoảng trắng. Hãy loại bỏ các khoảng trắng thừa ở giữa các từ.
Ví dụ:
Nhap chuoi: f8   fullstack
Ket qua: f8 fullstack*/

#include <string>
#include<iostream>
using namespace std;

int main(){
    string n;
    cout<<"nhap chuoi: ";
    getline(cin,n);
    int i = 0;
    while(i<n.length()){
        if(n[i] == ' ' && n[i+1] == ' '){
            n.erase(i,1);

    }
    else{
        i++;
    }

}
cout<<"Ket qua: "<< n;
}