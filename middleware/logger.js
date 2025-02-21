const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "logs", "activity.log");

// Đảm bảo thư mục logs tồn tại
if (!fs.existsSync(path.dirname(logFilePath))) {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

// Ghi log vào file
function logActivity(action, details) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${action}: ${JSON.stringify(details)}\n`;

    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error("Error writing log:", err);
        }
    });
}

module.exports = logActivity;