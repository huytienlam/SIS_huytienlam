# SRP & DRY DOCUMENTATION

- Sinh viên: LÂM TIẾN HUY
- MSSV: 22127151
- Môn: THIẾT KẾ PHẦN MỀM - 22KTPM3
- Version: 1.0

## SINGLE RESPONSIBILITY PRINCIPLE
1. Phần **students.js** chủ yếu dành cho routing, nhưng hiện tại một file route đó đang xử lý quá nhiều mặt.
=> Tách riêng ra các phần như controllers, views, middleware để tối ưu hoá SRP.
2. File **app.js** cũng đang chứa quá nhiều routes.
=> Tách riêng ra các routes theo chức năng.
3. Một số file **.js** trong mục scripts đang tương đối khó hiểu, mục views thì lại để lửng các page.
=> Điều chỉnh và sắp xếp lại nội dung bên trong. 
4. File **validate.js** đáng lẽ phải ở trong mục middleware.
=> Di chuyển file về middleware và khởi tạo lại đường dẫn nếu có sử dụng.
#### Chỉnh sửa sẽ xuất hiện trong các version sau.

## DON'T REPEAT YOURSELF
1. Kiểm tra điều kiện **Business Rules** trong việc import thông tin bị lặp lại nhiều lần ở các mục thêm sinh viên, sửa sinh viên, và nhập từ CSV, JSON.
=> **Đã hoàn thành.** Tạo một file **validate.js** để viết tất cả hàm điều kiện kiểm tra và public nó.
#### Sẽ có thêm chỉnh sửa xuất hiện trong các version sau.