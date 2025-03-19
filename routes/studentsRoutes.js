const express = require("express");
const router = express.Router();
const studentsController = require("../controllers/studentsController");

// CRUD sinh viên
router.get("/", studentsController.getStudentsList);
router.get("/add", studentsController.getAddStudentForm);
router.post("/add", studentsController.addStudent);
router.get("/check-id", studentsController.checkStudentId);
router.post("/delete/:id", studentsController.deleteStudent);
router.get("/update/:id", studentsController.getUpdateStudentForm);
router.post("/update/:id", studentsController.updateStudent);
router.get("/search", studentsController.searchStudents);

module.exports = router;