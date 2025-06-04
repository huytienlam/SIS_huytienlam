(function(global) {
    async function getEmailFormat() {
        try {
            let baseURL = typeof window !== "undefined" ? "" : "http://localhost:3000/manage-options"; // Nếu chạy trên backend, thêm host đầy đủ
            let response = await fetch(baseURL + "/options"); 
            let data = await response.json();
            return data.emailformat || [];
        } catch (error) {
            console.error("Lỗi khi lấy emailformat:", error);
            return [];
        }
    }

    async function validateEmail(email) {
        // Kiểm tra định dạng email cơ bản
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            return "Email không hợp lệ.";
        }
    
        // Lấy cấu hình email format
        let emailFormat = await getEmailFormat();
    
        // Kiểm tra xem email format có hợp lệ không
        if (!emailFormat || emailFormat.length !== 2) {
            return "Không tìm thấy cấu hình emailformat.";
        }
    
        const [expectedPrefix, expectedDomain] = emailFormat;
        const [userPrefix, userDomain] = email.split("@");
    
        console.log("Expected Prefix:", expectedPrefix);
        console.log("Expected Domain:", expectedDomain);
        console.log("User Prefix:", userPrefix);
        console.log("User Domain:", userDomain);
    
        if (!userDomain) return "Email không hợp lệ.";
    
        // Cắt domain thành hai phần: tên miền chính + phần mở rộng
        const domainParts = userDomain.split(".");
        const mainDomain = domainParts.slice(0, -1).join("."); // Tên miền chính
        const domainExtension = domainParts.slice(-1)[0]; // Phần mở rộng (.com, .vn, etc.)
    
        console.log("Expected Prefix:", expectedPrefix);
        console.log("Expected Domain:", expectedDomain);
        console.log("User Main Domain:", mainDomain);
        console.log("User Domain Extension:", domainExtension);
    
        // Kiểm tra xem mainDomain có giống expectedPrefix không
        if (mainDomain !== expectedPrefix) {
            return `Email phải có dạng: @${expectedPrefix}.${expectedDomain}`;
        }
    
        // Kiểm tra xem domainExtension có giống expectedDomain không
        if (domainExtension !== expectedDomain) {
            return `Phần mở rộng domain phải là: ${expectedDomain}`;
        }
    
        return ""; // Email hợp lệ
    }

    function validateId(id, course) {
        if (!/^\d{8}$/.test(id)) {
            return "MSSV phải có 8 số.";
        } else if (id.substring(0, 2) !== course.substring(2, 4)) {
            return "Hai số đầu của MSSV phải khớp với năm khóa học.";
        }
        return "";
    }

    function validateName(name) {
        if (!/^[A-ZÀ-ỹ][a-zà-ỹ]+(?: [A-ZÀ-ỹ][a-zà-ỹ]+)+$/.test(name)) {
            return "Tên phải có ít nhất 2 từ, không chứa số, và mỗi từ phải viết hoa chữ cái đầu.";
        }
        return "";
    }

    function validateDob(dob, course) {
        const birthYear = parseInt(dob.substring(0, 4));
        const currentYear = new Date().getFullYear();
        if (currentYear - birthYear < 16) {
            return "Sinh viên phải ít nhất 16 tuổi.";
        }
        if (parseInt(course) > currentYear) {
            return "Khóa học không thể lớn hơn năm hiện tại.";
        }
        if (parseInt(course) - birthYear < 17) {
            return "Sinh viên phải ít nhất 17 tuổi tính từ thời điểm khóa đó.";
        }
        return "";
    }

    function validatePhone(phone) {
        if (!/^(03|05|07|08|09)\d{8}$/.test(phone)) {
            return "Số điện thoại không hợp lệ.";
        }
        return "";
    }

    function validateGender(gender) {
        if (gender !== "Nam" && gender !== "Nữ") {
            return "Giới tính không hợp lệ.";
        }
        return "";
    }

    async function isValidStudent(student) {
        if (
            !student.id || !student.name || !student.dob || !student.gender ||
            !student.faculty || !student.course || !student.program ||
            !student.address || !student.email || !student.phone || !student.status
        ) {
            return false; // Bỏ qua nếu thiếu dữ liệu
        }
    
        if (validateId(student.id, student.course)) return false;
        if (validateName(student.name)) return false;
        if (validateDob(student.dob, student.course)) return false;
        if (validatePhone(student.phone)) return false;
        if (validateGender(student.gender)) return false;
    
        const emailError = await validateEmail(student.email);
        if (emailError) return false;
    
        return true;
    }

    // Dùng trên trình duyệt
    if (typeof window !== "undefined") {
        window.validateId = validateId;
        window.validateName = validateName;
        window.validateDob = validateDob;
        window.validateEmail = validateEmail;
        window.validatePhone = validatePhone;
        window.validateGender = validateGender;
        window.isValidStudent = isValidStudent;
    }

    // Dùng trên Node.js (backend)
    if (typeof module !== "undefined" && module.exports) {
        module.exports = { 
            validateId, 
            validateName, 
            validateDob, 
            validateEmail, 
            validatePhone, 
            validateGender,
            isValidStudent
        };
    }
})(this);