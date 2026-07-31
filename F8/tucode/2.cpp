/*Bài 2: Tạo mảng động có n phần tử nguyên (tối đa 10 phần tử). Nhập vào 1 số nguyên dương x (0 <= x <= 9) và xóa phần tử ở vị trí x.
Ví dụ:

n = 4
Nhap mang: 1 2 3 4
x = 1
Mang sau khi xoa: 1 3 4 */

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
    for(int i=0; i<size; i++)
    {
        cin>>arr[i];
    }
}
void output_array(int *arr, int &size)
{
    for(int i=0; i<size; i++)
    {
        cout<<arr[i]<<" ";
    }
}
void deleted_index(int *&arr, int &size, int delete_arr)
{
    // xoa phan tu o mang cu
    for(int i = delete_arr; i < size - 1; i++)
    {
        arr[i] = arr[i+1];
    }
    // tao mang moi
    int new_size = size - 1;
    int *tmp_arr = new int[new_size];
    // copy mang cu qua mang moi
    for(int i = 0 ; i < new_size ; i++)
    {
        tmp_arr[i] = arr[i];
    }
    // xoa phan tu cu
    delete[] arr;
    arr = tmp_arr;
    size--;
}

int main()
{
    int n,x;
    input_integer("n = ",n);
    cout<<"nhap mang: ";
    int *numbers = new int[n];
    input_array(numbers,n);
    input_integer("x = ",x);
    cout<<"mang sau khi xoa la: ";
    deleted_index(numbers,n,x);
    output_array(numbers,n);
}
