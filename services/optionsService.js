const fs = require("fs");
const path = require("path");
const optionsFile = path.join(__dirname, "../data/options.json");

function getOptions() {
    try {
        if (!fs.existsSync(optionsFile)) return { faculties: [], programs: [], statuses: [], emailformat: [] };
        const data = fs.readFileSync(optionsFile, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Lỗi đọc options.json:", error);
        return { faculties: [], programs: [], statuses: [], emailformat: [] };
    }
}

module.exports = { getOptions };