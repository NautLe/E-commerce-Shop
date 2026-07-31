/* Bài 3: Tạo mảng động có n phần tử nguyên (tối đa 10 phần tử). Nhập vào 1 số nguyên dương x (0 <= x <= 9) và số nguyên y. Thêm y vào vị trí x của mảng.
Ví dụ:

n = 4
Nhap mang: 1 2 3 4 4 4 
y = 7
x = 1
Mang sau khi them: 1 7 2 3 4 
*/

#include<math.h>
#include<iostream>
#include<string>
using namespace std;

void input_integer(string label, int &n)
{
    cout<<label;
    cin>>n;
}
void input_array(int *arr, int &size)
{
    for(int i = 0 ; i < size ; i++)
    {
        cin>>arr[i];
    }
}

void output_array(int *arr, int &size)
{
    for(int i = 0 ; i < size ; i++)
    {
        cout<<arr[i]<< " ";
    }
}

void add_integer(int *&arr, int &size, int new_index,int add_new)
{
    // tao ra mang moi
    int new_size = size + 1;
    int *tmp_arr = new int[new_size];
    // copy phan tu cu sang mang moi
    for(int i = 0; i < size ; i++){
        tmp_arr[i] = arr[i];
    }
    //them phan tu moi
    for(int i = size; i > new_index; i--){
        tmp_arr[i] = tmp_arr[i-1];
    }
    tmp_arr[new_index] = add_new;
    delete[]arr;
    arr = tmp_arr;
    size = new_size;
}


int main()
{
    int n,x,y;
    input_integer("nhap n = ", n);

    int *numbers = new int[n];
    cout<<"nhap mang: ";
    input_array(numbers , n);

    input_integer("y = ", y);
    input_integer("x = ", x);

    add_integer(numbers,n,x,y);
    cout<<"mang sau khi them: ";
    output_array(numbers,n);
    
}

