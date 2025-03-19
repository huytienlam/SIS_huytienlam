const express = require("express");
const router = express.Router();
const optionsController = require("../controllers/optionsController");

// Quản lý lựa chọn
router.get("/options", optionsController.getOptions);
router.post("/update-options", optionsController.updateOptions);
router.get("/", optionsController.manageOptionsPage);

module.exports = router;