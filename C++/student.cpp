#include "student.h"
using namespace std;

Student::Student(string id, string n, string d, string g, string f, string b, string p, string a, string e, string ph, string s) {
    if (!isValidID(id)) {
        throw invalid_argument("Mã số sinh viên không hợp lệ!");
    }
    if (!isValidDate(d)) {
        throw invalid_argument("Ngày sinh không hợp lệ!");
    }
    if (!isValidEmail(e)) {
        throw invalid_argument("Email không hợp lệ!");
    }
    if (!isValidPhone(ph)) {
        throw invalid_argument("Số điện thoại không hợp lệ!");
    }
    if (!isValidFaculty(f)) {
        throw invalid_argument("Khoa không hợp lệ!");
    }
    if (!isValidStatus(s)) {
        throw invalid_argument("Tình trạng không hợp lệ!");
    }

    studentID = id;
    name = n;
    dob = d;
    gender = g;
    faculty = f;
    batch = b;
    program = p;
    address = a;
    email = e;
    phone = ph;
    status = s;
}

void Student::printStudent() {
    cout << "MSSV: " << studentID << endl
        << "Họ tên: " << name << endl
        << "Ngày sinh: " << dob << endl
        << "Giới tính: " << gender << endl
        << "Khoa: " << faculty << endl
        << "Khoá: " << batch << endl
        << "Chương trình: " << program << endl
        << "Địa chỉ: " << address << endl
        << "Email: " << email << endl
        << "Số điện thoại: " << phone << endl
        << "Tình trạng: " << status << endl;
}

bool Student::setEmail(string newEmail) {
    if (isValidEmail(newEmail)) {
        email = newEmail;
        return true;
    }
    return false;
}

bool Student::setPhone(string newPhone) {
    if (isValidPhone(newPhone)) {
        phone = newPhone;
        return true;
    }
    return false;
}

bool Student::setFaculty(string newFaculty) {
    if (isValidFaculty(newFaculty)) {
        faculty = newFaculty;
        return true;
    }
    return false;
}

bool Student::setStatus(string newStatus) {
    if (isValidStatus(newStatus)) {
        status = newStatus;
        return true;
    }
    return false;
}

bool Student::isValidID(string id) {
    if (id.length() != 8) return false;
    for (char c : id) {
        if (!isdigit(c)) return false;
    }
    return true;
}

bool Student::isValidEmail(string email) {
    regex pattern(R"((\w+)(\.\w+)*@(\w+)(\.\w+)+)");
    return regex_match(email, pattern);
}

bool Student::isValidPhone(string phone) {
    regex pattern(R"((03[2-9]|05[6|8|9]|07[0-9]|08[1-9]|09[0-9])\d{7})");
    return regex_match(phone, pattern);
}

bool Student::isValidFaculty(string faculty) {
    return faculty == "Khoa Luật" || faculty == "Khoa Tiếng Anh thương mại" ||
        faculty == "Khoa Tiếng Nhật" || faculty == "Khoa Tiếng Pháp";
}

bool Student::isValidStatus(string status) {
    return  status == "Đang học" || status == "Đã tốt nghiệp" ||
        status == "Đã thôi học" || status == "Tạm dừng học";
}

bool Student::isValidDate(string date) {
    regex pattern(R"((\d{2})/(\d{2})/(\d{4}))");
    smatch match;
    if (!regex_match(date, match, pattern)) {
        return false;
    }

    int day, month, year;
    stringstream ss(date);
    char slash;
    ss >> day >> slash >> month >> slash >> year;

    if (month < 1 || month > 12) return false;

    int daysInMonth[] = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };

    bool isLeapYear = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
    if (isLeapYear && month == 2) {
        daysInMonth[1] = 29;
    }

    if (day < 1 || day > daysInMonth[month - 1]) return false;

    return true;
}