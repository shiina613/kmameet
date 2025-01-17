
const user_token = localStorage.getItem("user_token")
const meeting_tbody = document.getElementById("meeting_tbody")
const meeting_thead = document.getElementById("meeting_thead")

fetch("http://localhost:8080/meetings/my-meetings", {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${user_token}`
    }
})
    .then(response => response.json())
    .then(data => {
        console.log(data)
        meeting_tbody.innerHTML = ``
        data.forEach(element => {
            let btn = ``;

            if (user_position === "Thư ký") {
                switch (element.status) {
                    case "Chưa bắt đầu":
                        btn += `<button type="button" onclick='edit("${element.id}")'>Chỉnh sửa</button> `
                        break;
                    case "Sắp tới":
                        btn += `<button type="button" onclick='join("${element.path}", "${element.id}")'>Tham gia</button> `
                        break;
                    case "Đang diễn ra":
                        btn += `<button type="button" onclick='join("${element.path}")'>Tham gia</button> `
                        break;
                    case "Đã kết thúc":
                        btn += `Cuộc họp này đã kết thúc`
                        break;
                    case "Đã hủy":
                        btn += `Cuộc họp này đã bị hủy`
                        break;
                }
            } else {
                switch (element.status) {
                    case "Chưa bắt đầu":
                        btn += `Cuộc họp này chưa bắt đầu`
                        break;
                    case "Sắp tới":
                        btn += `<button type="button" onclick='join("${element.path}", "${element.id}")'>Tham gia</button> `
                        break;
                    case "Đang diễn ra":
                        btn += `<button type="button" onclick='join("${element.path}")'>Tham gia</button> `
                        break;
                    case "Đã kết thúc":
                        btn += `Cuộc họp này đã kết thúc`
                        break;
                    case "Đã hủy":
                        btn += `Cuộc họp này đã bị hủy`
                        break;
                }
            }



            meeting_tbody.innerHTML +=
                `      <tr>
                        <td>${element.name}</td>
                        <td>${element.rememberCode}</td>
                        <td>${element.department}</td>
                        <td>${element.startTime}</td>
                        <td>Tài liệu </td>
                        <td>${element.status}</td>
                        <td>${btn}</td>
                    </tr>`
        })
    })


join = (id_stringee, id_meeting) => {
    localStorage.setItem("id_meeting", id_meeting)
    localStorage.setItem("id_stringee", id_stringee)
    window.location.href = "http://127.0.0.1:5500/StringeeCloneOnlyJs/index.html"
}

edit = (id_edit_meeting) => {
    localStorage.setItem("id_edit_meeting", id_edit_meeting)
    window.location.href = "http://127.0.0.1:5500/src/edit/edit.html"
}