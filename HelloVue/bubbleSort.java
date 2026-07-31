public class bubbleSort {

    public static void bubbleSort(int[] arr) {
        int n = arr.length; // Lấy độ dài của mảng

        // Vòng lặp ngoài: Lặp qua từng phần tử của mảng.
        // n-1 lượt lặp là đủ vì sau mỗi lượt, phần tử lớn nhất
        // chưa được sắp xếp sẽ "nổi" lên vị trí cuối cùng đúng của nó.
        for (int i = 0; i < n - 1; i++) {
            // Vòng lặp trong: Duyệt qua các cặp phần tử liền kề.
            // (n - i - 1) vì:
            // - Mỗi lượt của vòng lặp ngoài, một phần tử lớn nhất đã được đặt đúng vị trí.
            // - Không cần so sánh với các phần tử đã được sắp xếp ở cuối mảng.
            for (int j = 0; j < n - i - 1; j++) {
                // So sánh phần tử hiện tại với phần tử kế tiếp
                if (arr[j] > arr[j + 1]) {
                    // Hoán đổi nếu phần tử hiện tại lớn hơn phần tử kế tiếp
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    public static void main(String[] args) {
        int[] data = {64, 34, 25, 12, 22, 11, 90}; // Mảng ví dụ
        System.out.println("Mảng trước khi sắp xếp:");
        printArray(data);

        bubbleSort(data); // Gọi hàm sắp xếp

        System.out.println("Mảng sau khi sắp xếp (Bubble Sort):");
        printArray(data);

        int[] data2 = {5, 1, 4, 2, 8};
        System.out.println("\nMảng 2 trước khi sắp xếp:");
        printArray(data2);
        bubbleSort(data2);
        System.out.println("Mảng 2 sau khi sắp xếp (Bubble Sort):");
        printArray(data2);
    }

    // Hàm tiện ích để in mảng
    public static void printArray(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i] + " ");
        }
        System.out.println();
    }
}