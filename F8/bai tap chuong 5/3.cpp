/*Bài 3: Viết chương trình nhập vào 1 chuỗi gồm các ký tự a -> z, A -> Z và có thể chứa khoảng trắng. Hãy viết hoa các chữ cái ở đầu mỗi từ, các chữ cái còn lại để ở dạng viết thường.
Ví dụ:

Nhap chuoi: f8 fulLsTack
Ket qua: F8 Fullstack*/


#include<iostream>
#include<string>
using namespace std;

int main(){
    string n;
    cout<<" nhap chuoi: ";
    getline(cin,n);
    if (n[0] != ' '){
        n[0] = toupper(n[0]);
    }
    //chuyen cac ki tu thanh cac ki tu thuong
    for(int i = 0 ; i  < n.length() ; i++)
    {
        n[i] = tolower(n[i]);

    }
    for(int i = 0 ; i  < n.length() ; i++){      
        if (n[i] == ' ' && n[i+1] != ' '){
            n[i+1] = toupper(n[i+1]);
    }
       }     
    cout<<"ket qua la: "<<n;

}