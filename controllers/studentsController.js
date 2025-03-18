const fs = require("fs");
const path = require("path");
const optionsFile = path.join(__dirname, "../data/options.json");
const { getStudents, saveStudents } = require("../services/studentsService");
const { getOptions, saveOptions } = require("../services/optionService");
const logActivity = require("../middleware/logger");
const { validateEmail, validatePhone } = require("../utils/validate");

exports.getStudentsList = (req, res) => {
    const students = getStudents();
    const options = getOptions();
    res.render("home", { 
        students, 
        faculties: options.faculties, 
        selectedFaculty: "" 
    });
};

exports.getAddStudentForm = (req, res) => {
    res.render("add-student");
};

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

exports.checkStudentId = (req, res) => {
    const students = getStudents();
    const exists = students.some(student => student.id === req.query.id);
    res.json({ exists });
};

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

exports.getUpdateStudentForm = (req, res) => {
    const students = getStudents();
    const student = students.find(s => s.id === req.params.id);
    if (!student) {
        return res.status(404).send("Không tìm thấy sinh viên.");
    }
    res.render("update-student", { student });
};

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

exports.searchStudents = (req, res) => {
    const query = req.query.query ? req.query.query.toLowerCase() : "";
    const facultyFilter = req.query.faculty || "";

    // Redirect to `/` if both filters are empty
    if (!query && !facultyFilter) {
        return res.redirect("/");
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
    res.render("home", { 
        students: filteredStudents, 
        faculties: options.faculties, 
        selectedFaculty: facultyFilter 
    });
};

exports.getOptions = (req, res) => {
    res.json(getOptions());
};

exports.updateOptions = (req, res) => {
    try {
        const { faculties, programs, statuses, emailformat } = req.body;

        // Đọc dữ liệu cũ
        const oldData = JSON.parse(fs.readFileSync(optionsFile, "utf-8"));

        // Tạo dữ liệu mới, nếu `emailformat` không được gửi lên, giữ nguyên dữ liệu cũ
        const newOptions = {
            faculties,
            programs,
            statuses,
            emailformat: emailformat !== undefined ? emailformat : oldData.emailformat,
        };

        // Ghi vào file JSON
        fs.writeFileSync(optionsFile, JSON.stringify(newOptions, null, 2), "utf-8");

        // Ghi log và phản hồi
        logActivity("Cập nhật danh sách lựa chọn", newOptions);
        res.json({ success: true, message: "Cập nhật danh sách thành công!" });
    } catch (error) {
        console.error("Error updating options.json:", error);
        res.status(500).json({ success: false, message: "Lỗi cập nhật dữ liệu." });
    }
};

exports.manageOptionsPage = (req, res) => {
    res.render("manage-options");
};