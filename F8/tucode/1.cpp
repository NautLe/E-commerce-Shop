/* Bài 1: Tạo mảng động có n phần tử nguyên (tối đa 10 phần tử). Nhập vào 1 số nguyên x và thêm x vào cuối mảng vừa tạo.
Ví dụ:

n = 4
Nhap mang: 1 2 3 4
x = 5
Mang sau khi them: 1 2 3 4 5*/

#include<math.h>
#include<iostream>
#include<string>
using namespace std;

void input_interger(string label, int &n)
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
        cout<<arr[i];
    }
}
void push(int *&arr, int &size, int new_element)
{
    // tao 1 mang moi
    int new_size = size + 1;
    int *tmp_arr = new int[new_size];
    // copy mang moi qua mang cu
    for(int i = 0 ; i < new_size ; i++)
    {
        tmp_arr[i] = arr[i];
    }
    // xoa phan tu cuoi trong mang va tang them 1 don vi
    tmp_arr[new_size - 1] = new_element;

    delete[] arr;
    arr = tmp_arr;
    size = new_size;
}

int main()
{
    int n,x;
    input_interger("n = ",n);

    int *numbers = new int[n];
    cout<<"nhap mang: ";
    input_array(numbers,n);
    input_interger("x =",x);
    push(numbers,n,x);
    cout<<"Mang sau khi in ra la: ";
    output_array(numbers,n);
}
