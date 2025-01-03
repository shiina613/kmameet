
const user_token = localStorage.getItem("user_token")
const meeting_tbody = document.getElementById("meeting_tbody")

fetch("http://localhost:8080/meetings/my-meetings", {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${user_token}`
    }
})
    .then(response => response.json())
    .then(data => {
        meeting_tbody.innerHTML = ``
        data.forEach(element => {
            let btn;
            if (element.status === "Đang diễn ra") {
                btn =
                    `<td><button type="button" onclick='join("${element.path}")'>Tham gia</button></td>`
            } else {
                btn = `<td>Hiện không thể tham gia  </td>`
            }
            meeting_tbody.innerHTML +=
                `      <tr>
                        <td>${element.name}</td>
                        <td>${element.rememberCode}</td>
                        <td>${element.department}</td>
                        <td>${element.startTime}</td>
                        <td>Tài liệu </td>
                        <td>${element.status}</td>
                        ${btn}
                    </tr>`
        })
    })


join = (roomId) => {
    localStorage.setItem("id_stringee", roomId)
}