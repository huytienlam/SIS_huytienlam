const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Đọc version.json
const versionPath = path.join(__dirname, "data", "version.json");
const versionData = JSON.parse(fs.readFileSync(versionPath, "utf8"));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/scripts", express.static(path.join(__dirname, "/scripts")));
app.use("/utils", express.static(path.join(__dirname, "/utils")));

// Setup Handlebars
app.engine("hbs", exphbs.engine({ 
    extname: "hbs",
    defaultLayout: "layout",  
    layoutsDir: "views/layouts",
    partialsDir: "views/partials",
    helpers: { eq: (a, b) => a === b }
}));
app.set("view engine", "hbs");

// Middleware truyền version vào view
app.use((req, res, next) => {
    res.locals.version = versionData.version;
    res.locals.buildDate = versionData.buildDate;
    next();
});

// Load routes
const studentRoutes = require("./routes/students");
app.use("/", studentRoutes);

// Trang chủ
app.get("/", (req, res) => {
    res.redirect("/students");
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
});
