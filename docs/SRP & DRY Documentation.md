# SRP & DRY DOCUMENTATION

- Sinh viên: LÂM TIẾN HUY
- MSSV: 22127151
- Môn: THIẾT KẾ PHẦN MỀM - 22KTPM3
- Version: 1.0

## SINGLE RESPONSIBILITY PRINCIPLE
1. Phần **students.js** chủ yếu dành cho routing, nhưng hiện tại file route đó đang xử lý quá nhiều mặt.
=> **Đã hoàn thành.** Tách riêng ra các phần như controllers, views, middleware để tối ưu hoá SRP.
2. Một số file **.js** trong mục scripts đang tương đối khó hiểu, mục views thì lại để lửng các page.
=> Điều chỉnh và sắp xếp lại nội dung bên trong.
3. File **validate.js** đáng lẽ phải ở trong mục /utils.
=> **Đã hoàn thành.** Di chuyển file về /utils và khởi tạo lại đường dẫn nếu có sử dụng.
4. Folder **logs** đang nằm trong middleware cùng với logger.js.
=> **Đã hoàn thành.** Chuyển thư mục logs ra thư mục gốc.
#### Chỉnh sửa sẽ tiếp tục xuất hiện trong các version sau.

## DON'T REPEAT YOURSELF
1. Kiểm tra điều kiện **Business Rules** trong việc import thông tin bị lặp lại nhiều lần ở các mục thêm sinh viên, sửa sinh viên, và nhập từ CSV, JSON.
=> **Đã hoàn thành.** Tạo một file **validate.js** để viết tất cả hàm điều kiện kiểm tra và public nó.
#### Chỉnh sửa sẽ tiếp tục xuất hiện trong các version sau.