const position_tbody = document.getElementById("position_tbody")

show_all_positions = () => {
    let count = 1;
    position_tbody.innerHTML = ``
    fetch("http://localhost:8080/positions", {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            positionData = data;

            data.forEach(element => {
                position_tbody.innerHTML +=
                    `    <tr id="position_${element.id}">
                                <td>${count}</td>
                                <td>${element.name}</td>
                                <td>
                                    <button type="button" onclick='delete_position("${element.id}")'>Xóa</button>
                                    <button type="button" onclick='pre_edit_position("${element.id}", "${element.name}")'>Chỉnh sửa</button>
                                </td>
                        </tr>`
                count += 1;
                new_employee_position.innerHTML +=
                    `<option value="${element.name}">${element.name}</option>`
            })
        })
        .catch(err => console.log("Gap loi: ", err))
}

show_all_positions()


delete_position = (id) => {
    fetch(`http://localhost:8080/positions/${id}`, {
        method: "DELETE"
    })
        .then(response => {
            if (response.ok) {
                alert("Xóa chức vụ thành công")
                show_all_positions()
            }
        })
        .catch(err => console.log(err))
}

pre_edit_position = (id, name) => {
    row_edit_position = document.getElementById(`position_${id}`)

    row_edit_position.innerHTML =
        `   <td>${id}</td>
            <td><input type="text" id="position_name_update" value="${name}"></td>
            <td>
                <button onclick='cancel_edit_position()'>Hủy</button>
                <button  onclick='edit_position("${id}")'>OK</button>
            </td>`
}

edit_position = (id) => {
    new_position_name = document.getElementById("position_name_update").value;

    new_position_data = {
        name: new_position_name,
    }

    console.log("Thong tin cap nhat chuc vu: ", new_position_data)

    fetch(`http://localhost:8080/positions/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(new_position_data)
    })
        .then(response => {
            if (response.ok) {
                alert("Cập nhật thông tin chức vụ thành công");
                show_all_positions()
            }
        })
        .catch(arr => console("Gap loi: ", err))
}

cancel_edit_position = () => {
    show_all_positions()
}

add_new_position = () => {
    new_position_name = document.getElementById("new_position_name").value;
    new_position_data = {
        name: new_position_name,
    }

    console.log("Thong tin chuc vu moi: ", new_position_data)

    fetch("http://localhost:8080/positions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(new_position_data)
    })
        .then(response => {
            if (response.ok) {
                alert("Thêm chức vụ thành công")
                show_all_positions()
            }
        })
        .catch(err => console.log("Gap loi: ", err))
}


