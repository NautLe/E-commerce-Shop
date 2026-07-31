#include <iostream>

int main()
{
    int a = 1;
    int b = ++a * a--;

    std::cout << b; // Output: ?
    
    return 0;
}