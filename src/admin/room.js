const room_tbody = document.getElementById("room_tbody")

show_all_rooms = () => {
    let count = 1;
    fetch("http://localhost:8080/rooms", {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            room_tbody.innerHTML = ``
            data.forEach(element => {
                room_tbody.innerHTML +=
                    `   <tr id="room_${element.id}">
                                <td>${count}</td>
                                <td>${element.name}</td>
                                <td>${element.capacity}</td>
                                <td>
                                    <button onclick='delete_room("${element.id}")'>Xóa phòng</button>
                                    <button type="button" onclick='pre_edit_room("${element.id}", "${element.name}", "${element.capacity}")'>Sửa phòng</button>
                                </td>
                        </tr>`
                count += 1;
            })
        })
        .catch(err => console.log("Gap loi: ", err))

}
show_all_rooms()

delete_room = (id) => {
    fetch(`http://localhost:8080/rooms/${id}`, {
        method: "DELETE"
    })
        .then(response => {
            if (response.ok) {
                alert("Xóa phòng thành công")
                show_all_rooms()
            }
        })
        .catch(err => console.log(err))
}

pre_edit_room = (id, name, capacity) => {
    row_edit_room = document.getElementById(`room_${id}`)

    row_edit_room.innerHTML =
        `   <td>${id}</td>
            <td><input type="text" id="room_name_update" value="${name}"></td>
            <td><input type="number" id="room_capacity_update" value="${capacity}"></td>
            <td>
                <button onclick='cancel_edit_room()'>Hủy</button>
                <button  onclick='edit_room("${id}")'>OK</button>
            </td>`
}

edit_room = (id) => {
    new_room_name = document.getElementById("room_name_update").value;
    new_room_capacity = document.getElementById("room_capacity_update").value;
    new_room_description = `Đã chỉnh sửa`

    new_room_data = {
        name: new_room_name,
        capacity: new_room_capacity,
        description: new_room_description
    }

    console.log("Thông tin cập nhật phòng: ", new_room_data)
    fetch(`http://localhost:8080/rooms/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(new_room_data)
    })
        .then(response => {
            if (response.ok) {
                alert("Cập nhật thông tin phòng thanh công!");
                show_all_rooms()
            }
        })
        .catch(arr => console("Gap loi: ", err))
}

cancel_edit_room = () => {
    show_all_rooms()
}

add_new_room = () => {
    new_room_name = document.getElementById("new_room_name").value;
    new_room_capacity = document.getElementById("new_room_capacity").value;
    new_room_description = document.getElementById("new_room_description").value;

    new_room_data = {
        name: new_room_name,
        capacity: new_room_capacity,
        description: new_room_description
    }

    console.log("Thong tin phong moi: ", new_room_data)

    fetch("http://localhost:8080/rooms", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(new_room_data)
    })
        .then(response => {
            if (response.ok) {
                alert("Thêm phòng họp thành công")
                show_all_rooms()
            }
        })
        .catch(err => console.log("Gặp lỗi: ", err))
}