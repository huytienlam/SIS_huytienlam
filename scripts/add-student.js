async function loadOptions() {
    try {
        let response = await fetch("/options");
        let data = await response.json();

        function populateSelect(id, items) {
            let select = document.getElementById(id);
            select.innerHTML = items.map(item => `<option>${item}</option>`).join("");
        }

        populateSelect("faculty", data.faculties);
        populateSelect("program", data.programs);
        populateSelect("status", data.statuses);
    } catch (error) {
        console.error("Lỗi tải danh sách:", error);
    }
}

document.getElementById("course").setAttribute("max", new Date().getFullYear());
document.addEventListener("DOMContentLoaded", loadOptions);

function showModal(message) {
    let modal = document.getElementById("errorModal");
    let modalMessage = document.getElementById("modalMessage");
    modalMessage.textContent = message;
    modal.style.display = "block";
}

// Xử lý nút Close dựa trên nội dung modal
document.getElementById("modalClose").addEventListener("click", function() {
    let modal = document.getElementById("errorModal");
    let msg = document.getElementById("modalMessage").textContent;
    modal.style.display = "none";
    // Nếu thông báo thành công, chuyển hướng về /students
    if (msg === "Thêm sinh viên thành công!") {
        window.location.href = "/";
    }
});

// Phần xử lý form vẫn giữ nguyên như trước (ví dụ gửi bằng fetch)
document.getElementById("studentForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Chặn submit mặc định
    let valid = true;
    let errors = document.querySelectorAll(".error");
    errors.forEach(error => error.textContent = ""); // Reset lỗi cũ

    let id = document.getElementById("id").value.trim();
    let name = document.getElementById("name").value.trim();
    let dob = document.getElementById("dob").value;
    let course = document.getElementById("course").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();

    // Kiểm tra bằng các hàm đã viết sẵn
    let validators = [
        { field: "id", error: validateId(id, course) },
        { field: "name", error: validateName(name) },
        { field: "dob", error: validateDob(dob, course) },
        { field: "email", error: validateEmail(email) },
        { field: "phone", error: validatePhone(phone) }
    ];

    // Hiển thị lỗi (nếu có)
    validators.forEach(({ field, error }) => {
        if (error) {
            document.querySelector(`#${field} + .error`).textContent = error;
            valid = false;
        }
    });

    // Kiểm tra MSSV tồn tại qua AJAX
    if (valid) {
        try {
            let response = await fetch("/check-id?id=" + encodeURIComponent(id));
            let data = await response.json();
            if (data.exists) {
                showModal("MSSV đã tồn tại! Hãy nhập một MSSV khác.");
                valid = false;
            }
        } catch (error) {
            console.error("Lỗi kiểm tra MSSV:", error);
            showModal("Lỗi kiểm tra MSSV.");
            valid = false;
        }
    }

    // Nếu hợp lệ, gửi form bằng fetch dưới dạng URL-encoded
    if (valid) {
        let formData = new FormData(this);
        let urlEncodedData = new URLSearchParams(formData);
        try {
            let submitResponse = await fetch("/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: urlEncodedData.toString()
            });
            if (!submitResponse.ok) {
                let errorText = await submitResponse.text();
                showModal(errorText);
            } else {
                showModal("Thêm sinh viên thành công!");
                this.reset();
            }
        } catch (error) {
            console.error("Lỗi submit:", error);
            showModal("Có lỗi xảy ra khi gửi dữ liệu.");
        }
    }
});