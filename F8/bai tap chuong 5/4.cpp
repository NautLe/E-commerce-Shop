/*Bài 4: Viết chương trình nhập vào 1 chuỗi gồm các ký tự a -> z, A -> Z và có thể chưa khoảng trắng. Hãy chuẩn hóa chuỗi đó.
Gợi ý:

Loại bỏ khoảng trắng đầu cuối.
Loại bỏ khoảng trắng thừa ở giữa các từ.
Viết hoa chữ cái đầu, các chữ còn lại viết thường.
Ví dụ:

Nhap chuoi:    bUI   duC   LONG 
Ket qua: Bui Duc Long*/


#include<iostream>
#include<string>
using namespace std;

int main(){
    
    string n;
    cout<<"nhap chuoi: ";
    getline(cin,n);
    //Loại bỏ khoảng trắng đầu 
    while(n[0] == ' '){
        n.erase(0,1);
    }
    //Loại bỏ khoảng trắng cuối.
    while(n[n.length()-1] == ' ')
    {
        n.erase(n.length()-1,1);
    }
    //Loại bỏ khoảng trắng thừa ở giữa các từ.
    int i = 0;
    while (i  < n.length())
    {   
        if (n[i] == ' ' && n[i+1] == ' '){
            n.erase(i,1);
        }
        else{
            i++;
    }
    }
    
    //Viết hoa chữ cái đầu, các chữ còn lại viết thường.
    for ( int i = 0 ; i< n.length();i++)
    {
       n[i] = tolower(n[i]);
    }
    n[0] = toupper(n[0]);
    for(int i = 0; i < n.length() ;i++){
        if (n[i] == ' ' && n[i+1] != ' '){
            n[i+1] = toupper(n[i+1]);
        }
    }
    cout<<"ket qua la : "<< n;

}
