# SIS_huytienlam

Sinh viên: LÂM TIẾN HUY
MSSV: 22127151
Môn: THIẾT KẾ PHẦN MỀM - 22KTPM3

# QUẢN LÝ SINH VIÊN


## 1. CẤU TRÚC SOURCE CODE
Folder bao gồm các file source code chính:
- main.cpp: Tệp chính chứa hàm main() để chạy chương trình.
- student.h & student.cpp: Thông tin sinh viên.
- studentManager.h & studentManager.cpp: Quản lý danh sách sinh viên.

File hỗ trợ để lấy thông tin sinh viên, mục đích chính để kiểm thử:
- dssv.txt: File default trong phần mềm để lưu trữ tất cả sinh viên, được import khi chạy và export khi thoát.
- sinhvien.txt: File các sinh viên để nhập liệu, đảm bảo các thông tin đều đúng.
- sinhvienerror.txt: File các sinh viên sai thông tin hoặc quy chuẩn, để kiểm tra các lệnh check thông tin trong chương trình.


## 2. COMPILE
Yêu cầu: Máy tính cần cài đặt trình biên dịch g++ hoặc các phần mềm, IDE hỗ trợ C++.

Cách 1: Biên dịch bằng g++
- Mở terminal/cmd và chạy lệnh sau để biên dịch tất cả các tệp .cpp:
    g++ -o tenchuongtrinh.exe *.cpp
- Lệnh trên sẽ tạo ra tệp thực thi tenchuongtrinh.exe

Cách 2: Phần mềm hoặc IDE
- Thêm các file .h, .cpp và .txt vào cùng project để compile ngôn ngữ C++.


3. CHẠY CHƯƠNG TRÌNH
Sau khi biên dịch thành công, chạy chương trình bằng lệnh: ./tenchuongtrinh.exe


## 4. QUY CHUẨN
Một file để chương trình có thể đọc và xử lý có định dạng như sau:
Sinh viên 1
(cách dòng)
Sinh viên 2
(cách dòng)
...
Sinh viên n (hết file)

Với mỗi sinh viên có đủ các trường dữ liệu và quy chuẩn sau:
MSSV (Phải đủ 8 chữ số)
Họ tên
Ngày sinh (dd/mm/yyyy hợp lệ)
Giới tính
Khoa (Chỉ nằm trong: Khoa Luật, Khoa Tiếng Anh thương mại, Khoa Tiếng Nhật, Khoa Tiếng Pháp)
Khóa
Chương trình
Địa chỉ
Email (Phải có đủ các phần tên@đơnvị.com)
Số điện thoại (Hợp lệ cho số điện thoại Việt Nam)
Tình trạng (Chỉ nằm trong: Đang học, Đã tốt nghiệp, Đã thôi học, Tạm dừng học)

LƯU Ý: File sai định dạng sẽ gây lỗi cho chương trình. Bất kì thông tin nào kể cả nhập hay import từ file đều không được thêm vào StudentManager hoặc lỗi nếu sai quy chuẩn như trên.


## 5. SỬ DỤNG CHƯƠNG TRÌNH
Chương trình sẽ hiển thị các tùy chọn cho phép quản lý danh sách sinh viên với các lựa chọn khác nhau.

KHỞI ĐỘNG
Chương trình tạo một StudentManager, cài sẵn một file mặc định hiện tại là "dssv.txt" như là file lưu trữ dữ liệu.
File default này có thể được đổi tên bằng cách tạo file .txt mới rồi nhập đúng tên vào phần defaultFile.
Từ file này, chương trình sẽ import vào StudentManager đó để thực hiện các thao tác tiếp theo.

LỰA CHỌN 1: THÊM SINH VIÊN
Nhập từng thông tin sinh viên theo đúng thứ tự ở phần 4. QUY CHUẨN.

LỰA CHỌN 2: XOÁ SINH VIÊN
Nhập MSSV của sinh viên cần xoá, nếu khớp thì sẽ loại bỏ sinh viên đó khôi StudentManager.

LỰA CHỌN 3: CẬP NHẬT SINH VIÊN
Nhập MSSV của sinh viên cần xoá, nếu khớp thì sẽ có thêm các lựa chọn cập nhật:
- Lựa chọn 1: Địa chỉ
- Lựa chọn 2: Email
- Lựa chọn 3: Số điện thoại
- Lựa chọn 4: Tình trạng sinh viên
Nếu đúng như những điều đặt ra ở phần 4. QUY CHUẨN thì cập nhật thành công.

LỰA CHỌN 4: TÌM KIẾM SINH VIÊN
Nhập tên hoặc MSSV của sinh viên cần tìm, nếu khớp sẽ hiện đầy đủ thông tin của sinh viên đó.

LỰA CHỌN 5: HIỂN THỊ DANH SÁCH SINH VIÊN
Hiển thị toàn bộ thông tin từ danh sách sinh viên hiện có trong StudentManager.

LỰA CHỌN 6: THÊM SINH VIÊN TỪ FILE .TXT CÓ SẴN
Ngoài việc nhập tay, lựa chọn này cho phép import thêm sinh viên từ file có cấu trúc tương tự.
Cách hoạt động tương tự việc import lúc khởi động, miễn đúng với phần 4. QUY CHUẨN.
Nhập tên file cần import sinh viên vào, nếu hợp lệ thì chương trình sẽ import vào StudentManager.

LỰA CHỌN 0: THOÁT
Chương trình sẽ lưu dữ liệu về lại file mặc định ban đầu, vẫn là "dssv.txt" và hoàn thành.
Vì thế, khi thoát và mở lại chương trình thì dữ liệu sẽ được đồng nhất.

ENJOY!
