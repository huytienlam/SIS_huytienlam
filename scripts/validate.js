const optionsFile = "./data/options.json";

(function(global) {
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

    function validateEmail(email) {
        if (email !== "" && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            return "Email không hợp lệ.";
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

    // Dùng trên trình duyệt
    if (typeof window !== "undefined") {
        window.validateId = validateId;
        window.validateName = validateName;
        window.validateDob = validateDob;
        window.validateEmail = validateEmail;
        window.validatePhone = validatePhone;
        window.validateGender = validateGender;
    }

    // Dùng trên Node.js (backend)
    if (typeof module !== "undefined" && module.exports) {
        module.exports = { 
            validateId, 
            validateName, 
            validateDob, 
            validateEmail, 
            validatePhone, 
            validateGender 
        };
    }
})(this);