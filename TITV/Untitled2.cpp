#include<stdio.h>

int main() {
    int a;
    int sum = 0;
    for (int i = 0; i < 10; i++) {
        scanf("%d", &a);
        sum += a;
    }
    printf("%d", sum);
    return 0;
}

//i = 0 => nhap a la 10 => sum = 10
//i = 1 => nhap a la 4 => sum = 14
//i = 2 => nhap a la 5 => sum = 19
//i = 3 => nhap a la 7 => sum = 26
//i = 4 => nhap a la 3 => sum = 29
//i = 5 => nhap a la 2 => sum = 31
//i = 6 => nhap a la 1 => sum = 32
// i = 7 => nhap a la 14 => sum = 46
//i = 8 => nhap a la 5 => sum = 51
// i = 9 => nhap a la 9 => sum = 60
