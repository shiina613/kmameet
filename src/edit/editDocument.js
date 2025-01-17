

addDocument = async (id_meeting) => {
    console.log("ID cuộc họp: ", id_meeting);

    // Lấy phần tử input và danh sách file
    const fileInput = document.getElementById("file-in");


    // Lấy danh sách các tệp được chọn
    const files = fileInput.files;

    // Kiểm tra nếu không có file nào được chọn
    if (files.length === 0) {
        alert("Không có tài liệu nào được chọn")
        return;
    }


    // Tạo đối tượng FormData để gửi các file
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]); // "files" là tên tham số phía server sẽ nhận
    }

    console.log(formData);
    fetch(`http://localhost:8080/documents/upload/${id_meeting}`, {
        method: "POST",
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                alert("Đã thêm tài liệu cho cuộc họp!")
            }
        })
        .catch(err => console.log("Gặp lỗi trong quá trình thêm tài liệu: ", err))
}