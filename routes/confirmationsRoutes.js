const express = require("express");
const path = require("path");
const router = express.Router();
const { generatePDF, generateDOCX } = require("../utils/certificateGenerator");
const { getStudents } = require("../services/studentsService");
const { getOptions } = require("../services/optionsService");

// Hàm lấy sinh viên theo MSSV
function getStudentById(id) {
    const students = getStudents(); // Lấy danh sách sinh viên từ service
    return students.find(student => student.id === id);
}

// Trang danh sách xác nhận
router.get("/", (req, res) => {
    const students = getStudents();
    const options = getOptions();

    res.render("confirmations", {
        students,
        faculties: options.faculties,
        selectedFaculty: ""
    });
});

// Xuất giấy xác nhận dạng PDF
router.get("/pdf/:id", async (req, res) => {
    const student = getStudentById(req.params.id);
    if (!student) {
        return res.status(404).send("Không tìm thấy sinh viên.");
    }
    
    await generatePDF(student, res);
});

// Xuất giấy xác nhận dạng DOCX
router.get("/docx/:id", async (req, res) => {
    const student = getStudentById(req.params.id);
    if (!student) {
        return res.status(404).send("Không tìm thấy sinh viên.");
    }
    
    await generateDOCX(student, res);
});

module.exports = router;