
pre_edit_meeting = () => {
    meeting_information_pre_edit.innerHTML =
        `   <p>Tên cuộc họp: <input type="text" id="name" value="${meeting_information.name}"></p>
            <p>Mã gợi nhớ: <input type="text" id="rememberCode" value="${meeting_information.rememberCode}"></p>
            <p>Thời gian bắt đầu: <input type="datetime-local" id="startTime" value="${meeting_information.startTime}"></p>
    

            <p>Phòng ban: <select id="department">
                    <option value="" >Chọn phòng ban</option>
                </select></p>

            <p>Phòng họp: <select id="room">
                    <option value = "">Chọn phòng họp</option>
                </select></p>
            <button onclick="edit_meeting(${meeting_information.id})">Chỉnh sửa</button>`
    const department = document.getElementById("department");
    const room = document.getElementById("room");

    fetch("http://localhost:8080/departments/allnames")
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                department.innerHTML += ` <option value="${element}">${element}</option>`
            })
        })

    fetch("http://localhost:8080/rooms")
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                room.innerHTML += ` <option value="${element.name}">${element.name}</option>`
            })
        })
}


edit_meeting = (id) => {
    const name = document.getElementById("name").value;
    const rememberCode = document.getElementById("rememberCode").value;
    const startTime = document.getElementById("startTime").value;
    const department = document.getElementById("department").value;
    const room = document.getElementById("room").value;

    if (!name || !rememberCode || !startTime || !department || !room) {
        alert("Vui lòng nhập đầy đủ thông tin")
        return
    }

    const editData = {
        name: name,
        rememberCode: rememberCode,
        startTime: startTime,
        department: department,
        room: room
    }

    console.log(editData)

    fetch(`http://localhost:8080/meetings/${id_edit_meeting}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(editData)
    })
        .then(response => {
            if (response.ok) {
                alert("Sửa thành công")
                window.location.href = "../edit/edit.html";

            } else {
                alert("Gặp lỗi")
            }
        })
}