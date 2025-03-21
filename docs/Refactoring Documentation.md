# REFACTORING DOCUMENTATION

- Sinh viên: LÂM TIẾN HUY
- MSSV: 22127151
- Môn: THIẾT KẾ PHẦN MỀM - 22KTPM3
- Version: 1.0

## ĐỊNH HƯỚNG
Quá trình refactoring nhằm tối ưu hóa codebase để đảm bảo:
- Tuân thủ nguyên tắc Single Responsibility Principle (SRP), mỗi module chỉ có một trách nhiệm duy nhất.
- Tuân thủ nguyên tắc Don't Repeat Yourself (DRY), loại bỏ sự trùng lặp không cần thiết.
- Cải thiện tính dễ đọc, bảo trì và mở rộng của hệ thống.

## REFACTORING
**Mục: Trước khi refactor => Sau khi refactor**
- SRP trong routes: File students.js chứa cả logic controller => Tách logic xử lý vào controllers. **Đã hoàn thành.**
- Validation: Phần kiểm tra dữ liệu bị lặp lại ở nhiều nơi => Tạo file validate.js để dùng chung xử lý dữ liệu. **Đã hoàn thành.**
- View & Scripts: Một số scripts chưa rõ ràng, views bị để lửng => Sắp xếp lại scripts và views có cấu trúc chặt chẽ hơn.
- Utils: validate.js không nằm trong utils => Di chuyển validate.js vào đúng thư mục và chỉnh lại đường dẫn import từ các trang. **Đã hoàn thành.**
- Logs: Thư mục logs đang nằm trong middleware cùng với logger.js => Chuyển thư mục logs ra thư mục gốc. **Đã hoàn thành.**
#### Chỉnh sửa sẽ tiếp tục xuất hiện trong các version sau.