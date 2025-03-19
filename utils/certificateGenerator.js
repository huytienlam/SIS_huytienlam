const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { Document, Packer, Paragraph, TextRun } = require("docx");

// Ngày
const today = new Date();
const validityDays = 30; // Số ngày hiệu lực
const expiryDate = new Date(today);
expiryDate.setDate(today.getDate() + validityDays);

// Đường dẫn tới font Unicode (chỉnh lại tùy theo project)
const FONT_PATH = path.join(__dirname, "../fonts/TIMES.TTF");
const VERSION_PATH = path.join(__dirname, "../data/version.json");

// Đọc thông tin từ version.json
let universityName = "TRƯỜNG ĐẠI HỌC [Tên Trường]";
try {
    const versionData = JSON.parse(fs.readFileSync(VERSION_PATH, "utf8"));
    if (versionData.universityName) {
        universityName = versionData.universityName;
    }
} catch (error) {
    console.error("Lỗi khi đọc version.json:", error);
}

// Hàm tạo PDF
async function generatePDF(student, res) {
    const doc = new PDFDocument();

    // Nhúng font Unicode
    doc.registerFont("Unicode", FONT_PATH);
    doc.font("Unicode"); // Áp dụng font Unicode

    // Thiết lập header cho trình duyệt tải file
    res.setHeader("Content-Disposition", `attachment; filename="${student.id}.pdf"`);
    res.setHeader("Content-Type", "application/pdf");

    // Gửi PDF trực tiếp về client mà không lưu vào server
    doc.pipe(res);

    // Nội dung PDF
    doc.fontSize(16).text(universityName, { align: "center" });
    doc.fontSize(14).text("PHÒNG ĐÀO TẠO", { align: "center" });
    doc.moveDown();
    
    doc.fontSize(18).text("GIẤY XÁC NHẬN TÌNH TRẠNG SINH VIÊN", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text("1. THÔNG TIN SINH VIÊN");
    doc.moveDown();

    doc.fontSize(12).text(`Họ và tên: ${student.name}`);
    doc.text(`Mã số sinh viên: ${student.id}`);
    doc.text(`Ngày sinh: ${student.dob}`);
    doc.text(`Giới tính: ${student.gender}`);
    doc.text(`Khoa: ${student.faculty}`);
    doc.text(`Chương trình đào tạo: ${student.program}`);
    doc.text(`Khóa: ${student.course}`);

    doc.moveDown();
    doc.fontSize(14).text("2. TÌNH TRẠNG HIỆN TẠI");
    doc.moveDown();
    doc.fontSize(12).text(`${student.status}`);
    
    doc.moveDown();
    doc.fontSize(14).text("3. THỜI GIAN CẤP GIẤY");
    doc.moveDown();
    doc.text(`Ngày cấp: ${today}`);
    doc.text(`Giấy xác nhận có hiệu lực đến ngày: ${expiryDate}`);

    doc.moveDown();
    doc.fontSize(12).text(`Xác nhận của ${universityName}`, { align: "left" });
    doc.text("Trưởng Phòng Đào Tạo", { align: "right" });

    // Kết thúc và gửi PDF
    doc.end();
}

// Hàm tạo DOCX
async function generateDOCX(student, res) {
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    // Tên trường
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: universityName,
                                bold: true,
                                size: 28,
                            }),
                        ],
                        alignment: "center",
                        spacing: { after: 100 },
                    }),

                    // Phòng đào tạo
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "PHÒNG ĐÀO TẠO",
                                bold: true,
                                size: 24,
                            }),
                        ],
                        alignment: "center",
                        spacing: { after: 200 },
                    }),

                    // Tiêu đề giấy xác nhận
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "GIẤY XÁC NHẬN TÌNH TRẠNG SINH VIÊN",
                                bold: true,
                                size: 26,
                            }),
                        ],
                        alignment: "center",
                        spacing: { after: 300 },
                    }),

                    // Mục 1: Thông tin sinh viên
                    new Paragraph({
                        text: "1. THÔNG TIN SINH VIÊN",
                        bold: true,
                        size: 22,
                        spacing: { before: 200, after: 100 },
                    }),
                    new Paragraph(`Họ và tên: ${student.name}`),
                    new Paragraph(`Mã số sinh viên: ${student.id}`),
                    new Paragraph(`Ngày sinh: ${student.dob}`),
                    new Paragraph(`Giới tính: ${student.gender}`),
                    new Paragraph(`Khoa: ${student.faculty}`),
                    new Paragraph(`Chương trình đào tạo: ${student.program}`),
                    new Paragraph(`Khóa: ${student.course}`),

                    // Mục 2: Tình trạng hiện tại
                    new Paragraph({
                        text: "2. TÌNH TRẠNG HIỆN TẠI",
                        bold: true,
                        size: 22,
                        spacing: { before: 200, after: 100 },
                    }),
                    new Paragraph(student.status),

                    // Mục 3: Thời gian cấp giấy
                    new Paragraph({
                        text: "3. THỜI GIAN CẤP GIẤY",
                        bold: true,
                        size: 22,
                        spacing: { before: 200, after: 100 },
                    }),
                    new Paragraph(`Ngày cấp: ${today.toLocaleDateString("vi-VN")}`),
                    new Paragraph(`Giấy xác nhận có hiệu lực đến ngày: ${expiryDate.toLocaleDateString("vi-VN")}`),

                    // Ký tên và xác nhận
                    new Paragraph({
                        text: `Xác nhận của ${universityName}`,
                        spacing: { before: 300 },
                    }),
                    new Paragraph({
                        text: "Trưởng Phòng Đào Tạo",
                        alignment: "right",
                        spacing: { before: 200 },
                    }),
                ],
            },
        ],
    });

    // Thiết lập headers để tải file về
    res.setHeader("Content-Disposition", `attachment; filename="${student.id}.docx"`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

    // Gửi file về client
    const buffer = await Packer.toBuffer(doc);
    res.send(buffer);
}

module.exports = { generatePDF, generateDOCX };