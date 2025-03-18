const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const studentsController = require("../controllers/studentsController");
const importExportController = require("../controllers/importExportController");

// CRUD sinh viên
router.get("/", studentsController.getStudentsList);
router.get("/add", studentsController.getAddStudentForm);
router.post("/add", studentsController.addStudent);
router.get("/check-id", studentsController.checkStudentId);
router.post("/delete/:id", studentsController.deleteStudent);
router.get("/update/:id", studentsController.getUpdateStudentForm);
router.post("/update/:id", studentsController.updateStudent);
router.get("/search", studentsController.searchStudents);

// Quản lý lựa chọn
router.get("/options", studentsController.getOptions);
router.post("/update-options", studentsController.updateOptions);
router.get("/manage-options", studentsController.manageOptionsPage);

// Import/Export
router.get("/import-export", importExportController.importExportPage);
router.post("/import-csv", upload.single("csvFile"), importExportController.importCSV);
router.post("/import-json", upload.single("jsonFile"), importExportController.importJSON);
router.get("/export-csv", importExportController.exportCSV);
router.get("/export-json", importExportController.exportJSON);

module.exports = router;