const fs = require("fs");
const path = require("path");
const { getOptions } = require("../services/optionsService");
const optionsFile = path.join(__dirname, "../data/options.json");
const logActivity = require("../middleware/logger");

// Lấy danh sách các tùy chọn (Khoa, Chương trình, Trạng thái)
exports.getOptions = (req, res) => {
    res.json(getOptions());
};

// Cập nhật danh sách các tùy chọn (Khoa, Chương trình, Trạng thái, Email format).
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

// Hiển thị trang quản lý các tùy chọn.
exports.manageOptionsPage = (req, res) => {
    res.render("manage-options");
};