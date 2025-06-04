const fs = require("fs");
const path = require("path");
const { getStudents, saveStudents } = require("../services/studentsService");
const { getOptions } = require("../services/optionsService");
const logActivity = require("../middleware/logger");
const { validateEmail, validatePhone } = require("../utils/validate");

// Lấy danh sách sinh viên
exports.getStudentsList = (req, res) => {
    const students = getStudents();
    const options = getOptions();
    res.render("home", { 
        students, 
        faculties: options.faculties, 
        selectedFaculty: "" 
    });
};

// Hiển thị form thêm sinh viên.
exports.getAddStudentForm = (req, res) => {
    res.render("add-student");
};

// Thêm sinh viên
exports.addStudent = (req, res) => {
    const students = getStudents();
    if (students.some(student => student.id === req.body.id)) {
        return res.status(400).send("MSSV đã tồn tại! Hãy nhập một MSSV khác.");
    }
    
    const newStudent = {
        id: req.body.id,
        name: req.body.name,
        dob: req.body.dob,
        gender: req.body.gender,
        faculty: req.body.faculty,
        course: req.body.course,
        program: req.body.program,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        status: req.body.status
    };

    students.push(newStudent);
    saveStudents(students);
    logActivity("Thêm sinh viên", newStudent);
    res.redirect("/");
};

// Kiểm tra xem MSSV đã tồn tại hay chưa.
exports.checkStudentId = (req, res) => {
    const students = getStudents();
    const exists = students.some(student => student.id === req.query.id);
    res.json({ exists });
};

// Xóa sinh viên
exports.deleteStudent = (req, res) => {
    let students = getStudents();
    const studentId = req.params.id.trim();
    const studentToDelete = students.find(student => student.id === studentId);

    if (!studentToDelete) {
        return res.status(404).send("Không tìm thấy sinh viên để xóa.");
    }

    students = students.filter(student => student.id !== studentId);
    saveStudents(students);
    logActivity("Xóa sinh viên", { id: studentId, name: studentToDelete.name });
    res.redirect("/");
};

// Hiển thị form cập nhật
exports.getUpdateStudentForm = (req, res) => {
    const students = getStudents();
    const student = students.find(s => s.id === req.params.id);
    if (!student) {
        return res.status(404).send("Không tìm thấy sinh viên.");
    }
    res.render("update-student", { student });
};

// Cập nhật sinh viên
exports.updateStudent = async (req, res) => {
    let students = getStudents();
    const index = students.findIndex(s => s.id === req.params.id);
    if (index === -1) {
        return res.status(404).send("Không tìm thấy sinh viên.");
    }
    const student = students[index];
    const oldData = { ...student };

    if (req.body.address && req.body.address.trim() !== "") {
        student.address = req.body.address.trim();
    }
    if (req.body.email && req.body.email.trim() !== "") {
        const email = req.body.email.trim();
        let errorMessage = await validateEmail(email);
        if (errorMessage) {
            return res.status(400).send(errorMessage);
        }
        student.email = email;
    }
    if (req.body.phone && req.body.phone.trim() !== "") {
        const phone = req.body.phone.trim();
        if (validatePhone(phone)) {
            return res.status(400).send("Số điện thoại không hợp lệ.");
        }
        student.phone = phone;
    }
    if (req.body.status && req.body.status.trim() !== "") {
        student.status = req.body.status.trim();
    }

    saveStudents(students);
    logActivity("Cập nhật sinh viên", { id: student.id, oldData, newData: student });
    res.redirect("/");
};

// Tìm kiếm theo MSSV/Họ tên và Khoa
exports.searchStudents = (req, res) => {
    const query = req.query.query ? req.query.query.toLowerCase() : "";
    const facultyFilter = req.query.faculty || "";
    const source = req.query.source || "";

    // Redirect về trang phù hợp nếu không có filter nào
    if (!query && !facultyFilter) {
        if (source === "confirmations") {
            return res.redirect("/confirmations");
        } else {
            return res.redirect("/");
        }
    }

    const students = getStudents();

    // Lọc theo MSSV/Họ tên nếu có nhập
    let filteredStudents = students;
    if (query) {
        filteredStudents = filteredStudents.filter(student => 
            student.id.toLowerCase().includes(query) ||
            student.name.toLowerCase().includes(query)
        );
    }

    // Lọc tiếp theo Khoa nếu có chọn
    if (facultyFilter) {
        filteredStudents = filteredStudents.filter(student => student.faculty === facultyFilter);
    }
    
    const options = getOptions();
    logActivity("Tìm kiếm sinh viên", { query, facultyFilter });

    // Chọn view để render dựa trên source (mặc định là home)
    const view = source === "confirmations" ? "confirmations" : "home";
    
    res.render(view, { 
        students: filteredStudents, 
        faculties: options.faculties, 
        selectedFaculty: facultyFilter,
        query,
        source
    });
};