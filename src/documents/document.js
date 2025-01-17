const user_token = localStorage.getItem("user_token")
const document_tbody = document.getElementById("document_tbody")

fetch("http://localhost:8080/documents/my-document", {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${user_token}`
    }
})
    .then(response => response.json())
    .then(data => {


        data = data.map(element => ({
            ...element,
            transcript: `http://127.0.0.1:5500/meeting_room/${element.transcript.replaceAll("\\", "/")}` // Thay \\ thành / và thêm tiền tố
        }));

        console.log("Dữ liệu về tài liệu của cuộc họp: ", data)


        document_tbody.innerHTML = ``
        data.forEach(element => {
            console.log(element)
            let open;
            if (element.transcript === null) {
                open = `<td><a href="#">Cuộp họp này không có tài liệu</a></td>`
            } else {
                open = `<td><a href="${element.transcript}">Mở tài liệu</a></td>`
            }
            document_tbody.innerHTML +=
                `                    <tr>
                        <td>${element.name}</td>
                        <td>${element.rememberCode}</td>
                        <td>${element.department}</td>
                        ${open}
                    </tr>`
        })
    })
    .catch(err => console.log("Gap loi: ", err))