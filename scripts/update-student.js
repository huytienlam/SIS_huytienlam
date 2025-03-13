document.getElementById("updateForm").addEventListener("submit", async function(event) {

    event.preventDefault(); // Chặn submit mặc định
    let valid = true;
    let errors = document.querySelectorAll("#updateForm .error");
    errors.forEach(error => error.textContent = "");

    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    // Trường Address và Status không bắt buộc cập nhật nếu để trống, giữ nguyên giá trị cũ

    // Kiểm tra email nếu người dùng nhập
    let emailError = validateEmail(email);
      if (emailError) {
          document.querySelector("#email + .error").textContent = emailError;
          valid = false;
      }
    
    // Check phone
    let phoneError = validatePhone(phone);
      if (phoneError) {
          document.querySelector("#phone + .error").textContent = phoneError;
          valid = false;
      }

    if (!valid) return;

    // Nếu hợp lệ, gửi form qua fetch
    let formData = new FormData(this);
    let urlEncodedData = new URLSearchParams(formData);

    try {
        let studentId = document.getElementById("updateForm").dataset.id;
        let response = await fetch(`/update/${studentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: urlEncodedData.toString()
      });
      if (!response.ok) {
        let errText = await response.text();
        showUpdateModal(errText);
      } else {
        showUpdateModal("Cập nhật thành công!");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      showUpdateModal("Có lỗi xảy ra khi cập nhật.");
    }
    
});

function showUpdateModal(message) {
  let modal = document.getElementById("updateModal");
  let modalMessage = document.getElementById("updateModalMessage");
  modalMessage.textContent = message;
  modal.style.display = "block";
}

document.getElementById("updateModalClose").addEventListener("click", function() {
  let modal = document.getElementById("updateModal");
  modal.style.display = "none";
  // Nếu cập nhật thành công, chuyển hướng về /students
  if (document.getElementById("updateModalMessage").textContent === "Cập nhật thành công!") {
    window.location.href = "/";
  }
});