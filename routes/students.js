const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const csvParser = require("csv-parser");
const logActivity = require("../middleware/logger");
const { validateEmail, validatePhone, isValidStudent } = require("../scripts/validate");

// Đường dẫn đến các file dữ liệu
const dataFile = "./data/students.json";
const optionsFile = "./data/options.json";

// Hàm đọc danh sách sinh viên từ file JSON
function getStudents() {
    try {
        if (!fs.existsSync(dataFile)) return []; // Nếu file chưa tồn tại, trả về mảng rỗng
        const data = fs.readFileSync(dataFile, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading students.json:", error);
        return [];
    }
}

// Hàm lưu danh sách sinh viên vào file JSON
function saveStudents(students) {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(students, null, 2), "utf-8");
    } catch (error) {
        console.error("Error writing to students.json:", error);
    }
}

// Hàm đọc danh sách các lựa chọn từ file JSON
function getOptions() {
    try {
        if (!fs.existsSync(optionsFile)) return { faculties: [], programs: [], statuses: [], emailformat: [] };
        const data = fs.readFileSync(optionsFile, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading options.json:", error);
        return { faculties: [], programs: [], statuses: [], emailformat: [] };
    }
}

// GET: Hiển thị danh sách sinh viên
router.get("/", (req, res) => {
    const students = getStudents();
    const options = getOptions();
    res.render("home", { 
        students, 
        faculties: options.faculties, 
        selectedFaculty: "" 
    });
});

// GET: Form thêm sinh viên
router.get("/add", (req, res) => {
    res.render("add-student");
});

// POST: Thêm sinh viên mới
router.post("/add", (req, res) => {
    const students = getStudents();
    
    // Kiểm tra xem MSSV đã tồn tại chưa
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
});

// API kiểm tra MSSV đã tồn tại chưa
router.get("/check-id", (req, res) => {
    const students = getStudents();
    const exists = students.some(student => student.id === req.query.id);
    res.json({ exists });
});

// POST: Xóa sinh viên
router.post("/delete/:id", (req, res) => {
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
});

// GET: Hiển thị form cập nhật thông tin sinh viên (theo MSSV)
router.get("/update/:id", (req, res) => {
    const students = getStudents();
    const student = students.find(s => s.id === req.params.id);
    if (!student) {
        return res.status(404).send("Không tìm thấy sinh viên.");
    }
    res.render("update-student", { student });
});

// POST: Cập nhật thông tin sinh viên (theo MSSV)
router.post("/update/:id", async (req, res) => {
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
});

// GET: Tìm kiếm sinh viên theo MSSV hoặc Họ tên và Khoa
router.get("/search", (req, res) => {
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
});

// API để lấy danh sách các lựa chọn
router.get("/options", (req, res) => {
    res.json(getOptions());
});

// API cập nhật danh sách lựa chọn
router.post("/update-options", (req, res) => {
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
});

// Tuỳ chỉnh lựa chọn
router.get("/manage-options", (req, res) => {
    res.render("manage-options");
});

// API Import từ CSV
router.post("/import-csv", upload.single("csvFile"), async (req, res) => {
    if (!req.file) {
        logActivity("IMPORT_CSV_ERROR", { error: "Không có file tải lên" });
        return res.status(400).send("Vui lòng tải lên một file CSV.");
    }

    const students = getStudents();
    const results = [];
    const filePath = req.file.path;

    const readCSV = async () => {
        return new Promise((resolve, reject) => {
            const pendingValidations = []; // Mảng chứa các promise validate

            fs.createReadStream(filePath)
                .pipe(csvParser({ separator: "," }))
                .on("data", (row) => {
                    if (row.id && row.name) {
                        const newStudent = {
                            id: row.id.trim(),
                            name: row.name.trim(),
                            dob: row.dob.trim(),
                            gender: row.gender.trim(),
                            faculty: row.faculty.trim(),
                            course: row.course.trim(),
                            program: row.program.trim(),
                            address: row.address.trim(),
                            email: row.email.trim(),
                            phone: row.phone.trim(),
                            status: row.status.trim()
                        };

                        if (!students.some(student => student.id === newStudent.id)) {
                            // Thêm promise kiểm tra vào mảng
                            const validationPromise = isValidStudent(newStudent).then(isValid => {
                                if (isValid) results.push(newStudent);
                            });
                            pendingValidations.push(validationPromise);
                        }
                    }
                })
                .on("end", async () => {
                    // Đợi tất cả quá trình validate hoàn tất
                    await Promise.all(pendingValidations);
                    resolve();
                })
                .on("error", (error) => reject(error));
        });
    };

    try {
        await readCSV();
        students.push(...results);
        saveStudents(students);
        fs.unlinkSync(filePath); // Xóa file tạm

        logActivity("IMPORT_CSV", { importedCount: results.length });
        res.redirect("/");
    } catch (error) {
        console.error("Lỗi xử lý CSV:", error);
        logActivity("IMPORT_CSV_ERROR", { error: error.toString() });
        res.status(500).send("Lỗi xử lý file CSV.");
    }
});

router.post("/import-json", upload.single("jsonFile"), async (req, res) => {
    if (!req.file) {
        logActivity("IMPORT_JSON_ERROR", { error: "Không có file tải lên" });
        return res.status(400).send("Vui lòng tải lên một file JSON.");
    }

    const students = getStudents();
    const filePath = req.file.path;

    try {
        const data = await fs.promises.readFile(filePath, "utf8");
        const newStudents = JSON.parse(data);

        let importedCount = 0;
        const pendingValidations = newStudents.map(async (student) => {
            if (student.id && student.name) {
                const isDuplicate = students.some(s => s.id === student.id);
                if (!isDuplicate) {
                    const isValid = await isValidStudent(student);
                    if (isValid) {
                        students.push(student);
                        importedCount++;
                    }
                }
            }
        });

        // Đợi tất cả kiểm tra xong
        await Promise.all(pendingValidations);

        saveStudents(students);
        fs.unlinkSync(filePath); // Xóa file tạm
        logActivity("IMPORT_JSON", { importedCount });

        res.redirect("/");
    } catch (error) {
        console.error("Lỗi xử lý JSON:", error);
        logActivity("IMPORT_JSON_ERROR", { error: error.toString() });
        res.status(400).send("File JSON không hợp lệ.");
    }
});

// Export CSV
router.get("/export-csv", (req, res) => {
    const students = getStudents();
    if (students.length === 0) {
        logActivity("EXPORT_CSV", { error: "Không có dữ liệu để xuất" });
        return res.status(404).send("Không có dữ liệu để xuất.");
    }
  
    let csvContent = "id,name,dob,gender,faculty,course,program,address,email,phone,status\n";
    students.forEach(student => {
        csvContent += `${student.id},${student.name},${student.dob},${student.gender},${student.faculty},${student.course},${student.program},${student.address},${student.email},${student.phone},${student.status}\n`;
    });
  
    // Thêm UTF-8 BOM để Excel đọc được tiếng Việt
    const csvBuffer = Buffer.from("\uFEFF" + csvContent, "utf-8");
  
    logActivity("EXPORT_CSV", { exportedCount: students.length });
    res.setHeader("Content-Disposition", "attachment; filename=students.csv");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.send(csvBuffer);
});

// Export JSON
router.get("/export-json", (req, res) => {
    const students = getStudents();
    logActivity("EXPORT_JSON", { exportedCount: students.length });
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=students.json");
    res.json(students);
});

// GET: Trang import/export
router.get("/import-export", (req, res) => {
    res.render("import-export");
});

module.exports = router;