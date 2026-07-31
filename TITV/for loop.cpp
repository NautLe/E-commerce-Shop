#include<stdio.h>

int main() {
    int a, b=0;
    scanf("%d",&a);
    for (int c = 0; c<=a; c+=1) {
        if(c%2 ==1){
            b +=1;
        }
    }
    printf("%d",b);
    return 0;
}
