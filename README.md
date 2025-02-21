# QUẢN LÝ SINH VIÊN

- Sinh viên: LÂM TIẾN HUY
- MSSV: 22127151
- Môn: THIẾT KẾ PHẦN MỀM - 22KTPM3
- GitHub Repository: https://github.com/huytienlam/SIS_huytienlam


## 1. CẤU TRÚC SOURCE CODE
- Folder C++ (old) hiện chỉ update tới Version 1.0.0, các version sau sẽ sử dụng web.

/SIS_huytienlam
│── /node_modules
│── /data
│   │── options.json *Chứa các tuỳ chọn cho Khoa, Chương trình, và Trạng thái*
│   │── students.json *Database chính chứa dữ liệu sinh viên*
│   │── version.json *Chứa version và build date*
│── /middleware
│   │── logger.js *Tạo activity log*
│   │── /logs
│       │── activity.logs *Lưu trữ lịch sử log*
│── /public
│   │── styles.css
│   │── sample.json *File JSON mẫu dữ liệu import*
│   │── sample.csv *File CSV mẫu dữ liệu import*
│── /routes
│   │── students.js *Routing cho các tính năng quản lý sinh viên*
│── /screenshots
│── /views
│   │── add-student.hbs *Trang thêm sinh viên*
│   │── home.hbs *Trang chủ, display toàn bộ sinh viên*
│   │── manage-options.hbs *Trang thay đổi tuỳ chọn cho Khoa, Chương trình, và Trạng thái*
│   │── update-student.hbs *Trang cập nhật dữ liệu sinh viên*
│   │── /partials
│   │   │── footer.hbs
│   │   │── header.hbs
│   │── /layouts
│       │── layout.hbs *Layout chính render*
│── app.js
│── package-lock.json
│── package.json
│── README.md


## 2. BIÊN DỊCH
- Máy được cài đặt Node.JS và Visual Studio Code.
- Tải folder từ GitHub về và giải nén.
- Mở terminal trong VSCode từ folder SIS_huytienlam.
- Gõ lệnh nodemon app.js.


## 3. CHẠY CHƯƠNG TRÌNH
- Truy cập http://localhost:3000 trên trình duyệt để xem chương trình.


## 4. QUY CHUẨN
### Khi thêm hoặc sửa thông tin sinh viên, có những quy chuẩn rõ ràng đặt ra:
- Không trùng MSSV.
- MSSV phải có 8 chữ số, 2 só đầu trùng khớp với 2 số sau trong Khoá.
- Từ ngày sinh đến khoá sinh viên tham gia học tập phải đủ 17 tuổi (cho những trường hợp chưa tới sinh nhật 18 tuổi).
- Email phải có đủ định dạng sample@email.com.
- Só điện thoại phải đủ 10 chữ số và đầu số phải chuẩn của Việt Nam.
### Import và Export có 2 định dạng JSON và CSV
- Khi import, lưu ý rằng định dạng cả 2 file phải tương tự sample.csv và sample.json trong thư mục public.


## 5. SỬ DỤNG CHƯƠNG TRÌNH
Chương trình sẽ hiển thị các tùy chọn cho phép quản lý danh sách sinh viên với các lựa chọn khác nhau.

### TRANG CHỦ
![Home](/screenshots/Main%20View.png)
- Web sẽ load các file data để thể hiện lên.
- Toàn bộ danh sách sinh viên sẽ được thể hiện lên Home.
- Trong mỗi sinh viên có phần Xoá và Sửa.
- Ô tìm kiếm theo MSSV hoặc Tên và Khoa.

*XOÁ SINH VIÊN*
- Bấm nút xoá kế bên sinh viên đó.

*TÌM KIẾM SINH VIÊN*
- Nhập tên hoặc MSSV và Khoa của sinh viên cần tìm, nếu khớp sẽ hiện đầy đủ thông tin của sinh viên đó.
- Có thể bỏ trống 1 trong 2 ô còn lại.

### CẬP NHẬT SINH VIÊN
![Update Student](/screenshots/Change%20Options.png)
- Khi chọn nút Sửa kế bên sinh viên đó trên trang *HOME* thì sẽ hiện ra trang này.
- Thay đổi Địa chỉ, Email, Số điện thoại, hoặc Tình trạng sinh viên nếu cần và chọn Cập nhật.
- Dựa theo quy chuẩn, nếu sai sẽ ngăn việc submit form, nếu đúng thì sinh viên sẽ được thay đổi.

### THÊM SINH VIÊN
![Add Student](/screenshots/Add%20Students.png)
- Trên Header, chọn Add Student.
- Gõ toàn bộ thông tin trong form và nhấn Add Student.
- Dựa theo quy chuẩn, nếu sai sẽ ngăn việc submit form, nếu đúng thì sinh viên sẽ được thêm vào database.

### THAY ĐỔI LỰA CHỌN (Khoa, Chương trình, và Trạng thái)
![Change Options](/screenshots/Change%20Options.png)
- Trên Header, chọn Manage.
- Thêm, xoá, hoặc sửa các tuỳ chọn của Khoa, Chương trình, và Trạng thái.
- Nếu hoàn thành, chọn Lưu thay đổi.

### IMPORT VÀ EXPORT FILE (JSON và CSV)
*IMPORT*
- Chọn tệp ngay vị trí CSV, bấm Tải lên CSV.
- (HOẶC) chọn tệp ngay vị trí JSON, bấm Tải lên JSON.
- Nếu hợp lệ, thông tin sẽ được cập nhật vào database.

*EXPORT*
- Bấm Tải về CSV để tải database sinh viên dạng CSV.
- Bấm Tải về JSON để tải database sinh viên dạng JSON.

### ACTIVITY LOG
- Xem activity log trong /middleware/logs/activity.log


#### Đó là toàn bộ tính năng của Version 2.1.1.