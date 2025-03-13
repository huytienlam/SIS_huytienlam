// Hiển thị modal thông báo với nội dung tùy chỉnh
function showModal(message) {
    let modal = document.getElementById("messageModal");
    let modalText = document.getElementById("modalText");
    modalText.textContent = message;
    modal.style.display = "block";
}

// Đóng modal khi người dùng bấm nút "Đóng"
document.getElementById("closeModal").addEventListener("click", function() {
    document.getElementById("messageModal").style.display = "none";
    window.location.href = "/"; // Điều hướng về trang chủ, có thể thay đổi nếu cần
});

// Khi trang được tải xong, gọi hàm loadOptions() để lấy dữ liệu từ server
document.addEventListener("DOMContentLoaded", async function () {
    await loadOptions();
});

// Hàm tải danh sách khoa, chương trình, trạng thái và format email từ server
async function loadOptions() {
    try {
        let response = await fetch("/options"); // Gửi request GET để lấy dữ liệu từ server
        let data = await response.json(); // Chuyển response thành JSON

        // Hàm render danh sách vào giao diện
        function renderList(id, items) {
            let list = document.getElementById(id + "List");
            list.innerHTML = items.map((item, index) => 
                `<li>
                    <input class="option-group-ul" type="text" value="${item}" id="${id}-${index}">
                    <button class="update-delete-button" onclick="removeItem('${id}', ${index})">Xóa</button>
                </li>`).join(""); // Chuyển danh sách thành chuỗi HTML
        }

        // Hiển thị dữ liệu trên giao diện
        renderList("faculty", data.faculties);
        renderList("program", data.programs);
        renderList("status", data.statuses);

        // Load email format nếu có dữ liệu
        if (data.emailformat.length === 2) {
            document.querySelector("#email-prefix").value = data.emailformat[0].replace("@", ""); // Bỏ ký tự "@"
            document.querySelector("#email-domain").value = data.emailformat[1].replace(".", ""); // Bỏ ký tự "."
        }
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
    }
}

// Thêm một mục mới vào danh sách (khoa, chương trình, trạng thái)
function addItem(category) {
    let list = document.getElementById(category + "List");
    let index = list.children.length; // Xác định index của mục mới
    let newItem = `<li>
        <input class="option-group-ul" type="text" id="${category}-${index}">
        <button class="update-delete-button" onclick="removeItem('${category}', ${index})">Xóa</button>
    </li>`;
    list.insertAdjacentHTML("beforeend", newItem); // Chèn vào cuối danh sách
}

// Xóa một mục khỏi danh sách
function removeItem(category, index) {
    document.getElementById(category + "List").children[index].remove();
}

// Lưu thay đổi dữ liệu lên server
async function saveChanges() {
    let getValues = (id) => [...document.querySelectorAll(`#${id}List input`)]
        .map(input => input.value.trim())
        .filter(Boolean);

    let emailPrefix = document.getElementById("email-prefix").value.trim();
    let emailDomain = document.getElementById("email-domain").value.trim();

    try {
        // Tải dữ liệu cũ từ server
        let response = await fetch("/options");
        let oldData = await response.json();

        // Nếu người dùng không nhập gì, giữ nguyên dữ liệu cũ
        let emailformat = (emailPrefix || emailDomain) 
            ? [`@${emailPrefix}`, `.${emailDomain}`] 
            : oldData.emailformat; // Giữ nguyên nếu không nhập gì

        let data = {
            faculties: getValues("faculty"),
            programs: getValues("program"),
            statuses: getValues("status"),
            emailformat: emailformat
        };

        console.log("Dữ liệu gửi lên:", data);

        let updateResponse = await fetch("/update-options", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        let result = await updateResponse.json();

        if (result.success) {
            showModal("Cập nhật thành công!");
        } else {
            showModal("Cập nhật thất bại!");
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật danh sách:", error);
        showModal("Có lỗi xảy ra, vui lòng thử lại!");
    }
}