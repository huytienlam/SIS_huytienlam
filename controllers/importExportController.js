const fs = require("fs");
const csvParser = require("csv-parser");
const { getStudents, saveStudents } = require("../services/studentsService");
const logActivity = require("../middleware/logger");
const { isValidStudent } = require("../utils/validate");

// Import từ CSV
exports.importCSV = async (req, res) => {
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
};

// Import từ JSON
exports.importJSON = async (req, res) => {
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
                if (!students.some(s => s.id === student.id)) {
                    const isValid = await isValidStudent(student);
                    if (isValid) {
                        students.push(student);
                        importedCount++;
                    }
                }
            }
        });

        await Promise.all(pendingValidations);

        saveStudents(students);
        fs.unlinkSync(filePath);
        logActivity("IMPORT_JSON", { importedCount });

        res.redirect("/");
    } catch (error) {
        console.error("Lỗi xử lý JSON:", error);
        logActivity("IMPORT_JSON_ERROR", { error: error.toString() });
        res.status(400).send("File JSON không hợp lệ.");
    }
};

// Export CSV
exports.exportCSV = (req, res) => {
    const students = getStudents();
    if (students.length === 0) {
        logActivity("EXPORT_CSV", { error: "Không có dữ liệu để xuất" });
        return res.status(404).send("Không có dữ liệu để xuất.");
    }

    let csvContent = "id,name,dob,gender,faculty,course,program,address,email,phone,status\n";
    students.forEach(student => {
        csvContent += `${student.id},${student.name},${student.dob},${student.gender},${student.faculty},${student.course},${student.program},${student.address},${student.email},${student.phone},${student.status}\n`;
    });

    const csvBuffer = Buffer.from("\uFEFF" + csvContent, "utf-8");

    logActivity("EXPORT_CSV", { exportedCount: students.length });
    res.setHeader("Content-Disposition", "attachment; filename=students.csv");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.send(csvBuffer);
};

// Export JSON
exports.exportJSON = (req, res) => {
    const students = getStudents();
    logActivity("EXPORT_JSON", { exportedCount: students.length });
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=students.json");
    res.json(students);
};

// Trang Import/Export
exports.importExportPage = (req, res) => {
    res.render("import-export");
};