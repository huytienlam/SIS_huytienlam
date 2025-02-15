#include "main.h"
using namespace std;

int main() {
    StudentManager manager;

    string defaultFile = "dssv.txt";
    manager.loadFromFile(defaultFile);

    while (true) {
        cout << endl << "================= QUẢN LÝ SINH VIÊN =================" << endl << endl;
        cout << "1. Thêm sinh viên" << endl;
        cout << "2. Xóa sinh viên" << endl;
        cout << "3. Cập nhật sinh viên" << endl;
        cout << "4. Tìm kiếm sinh viên" << endl;
        cout << "5. Hiển thị danh sách sinh viên" << endl;
        cout << "6. Thêm sinh viên từ file .txt có sãn" << endl;
        cout << "0. Thoát" << endl << endl;
        cout << "Lựa chọn: ";

        int choice;
        cin >> choice;
        cin.ignore();
        if (cin.fail()) {
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            continue;
        }

        if (choice == 1) {
            string id, name, dob, gender, faculty, batch, program, address, email, phone, status;
            cout << "Nhập MSSV: "; getline(cin, id);
            cout << "Nhập Họ tên: "; getline(cin, name);
            cout << "Nhập Ngày sinh: "; getline(cin, dob);
            cout << "Nhập Giới tính: "; getline(cin, gender);
            cout << "Nhập Khoa: "; getline(cin, faculty);
            cout << "Nhập Khóa: "; getline(cin, batch);
            cout << "Nhập Chương trình: "; getline(cin, program);
            cout << "Nhập Địa chỉ: "; getline(cin, address);
            cout << "Nhập Email: "; getline(cin, email);
            cout << "Nhập Số điện thoại: "; getline(cin, phone);
            cout << "Nhập Tình Trạng: "; getline(cin, status);

            Student newStudent(id, name, dob, gender, faculty, batch, program, address, email, phone, status);
            manager.addStudent(newStudent);
        }

        else if (choice == 2) {
            string id;
            cout << "Nhập MSSV cần xóa: ";
            getline(cin, id);
            manager.removeStudent(id);
        }

        else if (choice == 3) {
            string id;
            cout << "Nhập MSSV cần cập nhật: ";
            getline(cin, id);
            manager.updateStudent(id);
        }

        else if (choice == 4) {
            string keyword;
            cout << "Nhập MSSV hoặc tên sinh viên: ";
            getline(cin, keyword);
            manager.searchStudent(keyword);
        }

        else if (choice == 5) {
            manager.displayAllStudents();
        }

        else if (choice == 6) {
            string inputFile;
            cout << "Nhập tên file định dạng .txt: ";
            getline(cin, inputFile);

            if (inputFile.size() < 4 || inputFile.substr(inputFile.size() - 4) != ".txt") {
                cout << "Lỗi: File phải có đuôi .txt!" << endl;
            }
            manager.loadFromFile(inputFile);
        }

        else if (choice == 0) {
            manager.saveToFile(defaultFile);
            cout << "Chương trình đã thoát!" << endl;
            break;
        }

        else {
            cout << "Lựa chọn không hợp lệ! Vui lòng chọn lại!" << endl;
        }
    }

    return 0;
}