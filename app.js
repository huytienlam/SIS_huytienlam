const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup Handlebars
app.engine("hbs", exphbs.engine({ 
    extname: "hbs",
    defaultLayout: "layout",  
    layoutsDir: "views/layouts",
    partialsDir: "views/partials",  // Add this line to specify the partials folder
    helpers: {
        eq: function(a, b) { 
            return a === b; 
        }
    }
}));

app.set("view engine", "hbs");

// Load student routes
const studentRoutes = require("./routes/students");
app.use("/", studentRoutes);

// Upload file
const fileUpload = require("express-fileupload");
app.use(fileUpload());

// Homepage
app.get("/", (req, res) => {
    res.redirect("/students");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
