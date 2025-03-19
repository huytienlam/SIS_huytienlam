const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const importExportController = require("../controllers/importExportController");

// Import/Export
router.get("/", importExportController.importExportPage);
router.post("/import-csv", upload.single("csvFile"), importExportController.importCSV);
router.post("/import-json", upload.single("jsonFile"), importExportController.importJSON);
router.get("/export-csv", importExportController.exportCSV);
router.get("/export-json", importExportController.exportJSON);

module.exports = router;