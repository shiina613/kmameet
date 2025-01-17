const role_tbody = document.getElementById("role_tbody")

show_all_roles = () => {
    let count = 1;
    fetch("http://localhost:8080/roles", {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            role_tbody.innerHTML = ``
            data.forEach(element => {
                role_tbody.innerHTML +=
                    `   <tr id="role_${element.id}">
                                <td>${count}</td>
                                <td>${element.name}</td>
                                <td>${element.description}</td>
                                <td>
                                    <button onclick='delete_role("${element.id}")'>Xóa</button>
                                    <button  onclick='pre_edit_role("${element.id}", "${element.name}", "${element.description}")'>Chỉnh sửa</button>
                                </td>
                        </tr>`

                count += 1;
            })
        })
        .catch(err => console.log("Gap loi: ", err))
}

show_all_roles()



delete_role = (id) => {
    fetch(`http://localhost:8080/roles/${id}`, {
        method: "DELETE"
    })
        .then(response => {
            if (response.ok) {
                alert("Xóa chức danh thành công!")
                show_all_roles()
            }
        })
        .catch(err => console.log(err))
}

pre_edit_role = (id, name, description) => {
    row_edit_role = document.getElementById(`role_${id}`)

    row_edit_role.innerHTML =
        `   <td>${id}</td>
            <td><input type="text" id="role_name_update" value="${name}"></td>
            <td><input type="text" id="role_description_update" value="${description}"></td>
            <td>
                <button onclick='cancel_edit_role()'>Hủy</button>
                <button  onclick='edit_role("${id}")'>OK</button>
            </td>`
}

edit_role = (id) => {
    new_role_name = document.getElementById("role_name_update").value;
    new_role_description = document.getElementById("role_description_update").value;

    new_role_data = {
        name: new_role_name,
        description: new_role_description
    }

    console.log("Thong tin cap nhat phong: ", new_role_data)
    fetch(`http://localhost:8080/roles/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(new_role_data)
    })
        .then(response => {
            if (response.ok) {
                alert("Cập nhật thông tin chức danh thành công!");
                show_all_roles()
            }
        })
        .catch(arr => console("Gap loi: ", err))
}

cancel_edit_role = () => {
    show_all_roles()
}

add_new_role = () => {
    new_role_name = document.getElementById("new_role_name").value;
    new_role_description = document.getElementById("new_role_description").value;

    new_role_data = {
        name: new_role_name,
        description: new_role_description
    }

    console.log("Thong tin role moi: ", new_role_data)

    fetch("http://localhost:8080/roles", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(new_role_data)
    })
        .then(response => {
            if (response.ok) {
                alert("Thêm chức danh thành công!")
                show_all_roles()
            }
        })
        .catch(err => console.log("Gap loi: ", err))
}