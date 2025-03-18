const fs = require("fs");
const path = require("path");
const dataFile = path.join(__dirname, "../data/students.json");

// Đọc danh sách sinh viên
function getStudents() {
    try {
        if (!fs.existsSync(dataFile)) return []; // Nếu file chưa tồn tại, trả về mảng rỗng
        const data = fs.readFileSync(dataFile, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Lỗi đọc students.json:", error);
        return [];
    }
}

// Lưu danh sách sinh viên
function saveStudents(students) {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(students, null, 2), "utf-8");
    } catch (error) {
        console.error("Lỗi ghi students.json:", error);
    }
}

module.exports = { getStudents, saveStudents };