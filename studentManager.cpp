#include "studentManager.h"
using namespace std;

void StudentManager::addStudent(Student student) {
    for (int i = 0; i < students.size(); i++) {
        if (students[i].getID() == student.getID()) {
            cout << "Lỗi: MSSV đã tồn tại!" << endl;
            return;
        }
    }

    students.push_back(student);
    cout << "Đã thêm sinh viên!" << endl;
}

void StudentManager::removeStudent(string id) {
    bool found = false;

    for (std::vector<Student>::iterator it = students.begin(); it != students.end(); ) {
        if (it->getID() == id) {
            it = students.erase(it);
            found = true;
        }
        else {
            ++it;
        }
    }

    if (found) {
        cout << "Đã xóa sinh viên có MSSV: " << id << endl;
    }
    else {
        cout << "Không tìm thấy sinh viên có MSSV: " << id << endl;
    }
}

void StudentManager::updateStudent(string id) {
    for (int i = 0; i < students.size(); i++) {
        if (students[i].getID() == id) {
            int choice;
            string newValue;

            cout << "Chọn thông tin cần cập nhật:" << endl;
            cout << "1. Địa chỉ" << endl;
            cout << "2. Email" << endl;
            cout << "3. Số điện thoại" << endl;
            cout << "4. Tình trạng sinh viên" << endl;
            cout << "Nhập lựa chọn: ";
            cin >> choice;
            cin.ignore();

            cout << "Nhập giá trị mới: ";
            getline(cin, newValue);

            if (choice == 1) {
                students[i].setAddress(newValue);
                cout << "Đã cập nhật địa chỉ." << endl;
            }
            else if (choice == 2) {
                if (!Student::isValidEmail(newValue)) {
                    cout << "Lỗi: Email không hợp lệ!" << endl;
                    return;
                }
                students[i].setEmail(newValue);
                cout << "Đã cập nhật email." << endl;
            }
            else if (choice == 3) {
                if (!Student::isValidPhone(newValue)) {
                    cout << "Lỗi: Số điện thoại không hợp lệ!" << endl;
                    return;
                }
                students[i].setPhone(newValue);
                cout << "Đã cập nhật số điện thoại." << endl;
            }
            else if (choice == 4) {
                if (!Student::isValidStatus(newValue)) {
                    cout << "Lỗi: Tình trạng sinh viên không hợp lệ!" << endl;
                    return;
                }
                students[i].setStatus(newValue);
                cout << "Đã cập nhật tình trạng sinh viên." << endl;
            }
            else {
                cout << "Lựa chọn không hợp lệ." << endl;
                return;
            }
            return;
        }
    }
    cout << "Không tìm thấy sinh viên có MSSV: " << id << endl;
}

void StudentManager::searchStudent(string keyword) {
    bool found = false;
    for (int i = 0; i < students.size(); i++) {
        if (students[i].getID() == keyword || students[i].getName().find(keyword) != string::npos) {
            students[i].printStudent();
            found = true;
        }
    }
    if (!found) {
        cout << "Không tìm thấy sinh viên." << endl;
    }
}

void StudentManager::displayAllStudents() {
    cout << endl << "Số lượng sinh viên: " << students.size() << endl << endl;
    for (int i = 0; i < students.size(); i++) {
        students[i].printStudent();
        cout << endl;
    }
}

void StudentManager::loadFromFile(string filename) {
    ifstream file(filename.c_str());
    if (!file) {
        cout << "File dữ liệu sinh viên chưa được tải đúng cách!" << endl;
        cout << "Vui lòng kiểm tra lại tên file!" << endl;
        return;
    }

    string id, name, dob, gender, faculty, batch, program, address, email, phone, status;

    while (getline(file, id)) {
        if (id.empty()) continue;

        getline(file, name);
        getline(file, dob);
        getline(file, gender);
        getline(file, faculty);
        getline(file, batch);
        getline(file, program);
        getline(file, address);
        getline(file, email);
        getline(file, phone);
        getline(file, status);

        try {
            Student s(id, name, dob, gender, faculty, batch, program, address, email, phone, status);
            addStudent(s);
        }
        catch (const invalid_argument& e) {
            cout << "Lỗi: " << e.what() << " - ID: " << id << ". Bỏ qua!" << endl;
        }
    }

    cout << "Đã tải danh sách sinh viên từ file " << filename << "!" << endl << endl;
}

void StudentManager::saveToFile(string filename) {
    ofstream file(filename.c_str(), ios::out);

    if (!file) {
        cout << "Danh sách sinh viên chưa được tải đúng cách!" << endl;
        cout << "Vui lòng kiểm tra lại tên file!" << endl;
        return;
    }

    for (size_t i = 0; i < students.size(); i++) {
        Student s = students[i];

        file << s.getID() << endl
            << s.getName() << endl
            << s.getDOB() << endl
            << s.getGender() << endl
            << s.getFaculty() << endl
            << s.getBatch() << endl
            << s.getProgram() << endl
            << s.getAddress() << endl
            << s.getEmail() << endl
            << s.getPhone() << endl
            << s.getStatus();

        if (i < students.size() - 1) {
            file << endl << endl;
        }
    }

    file.close();
    cout << "Dữ liệu đã được ghi lại vào file " << filename << "!" << endl;
}