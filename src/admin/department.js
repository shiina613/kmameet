const department_tbody = document.getElementById("department_tbody")

show_all_departments = () => {

    fetch("http://localhost:8080/departments", {
        method: "GET"
    })
        .then(response => response.json())
        .then(async (data) => {
            departmentData = data;
            console.log("Dapartment Data raw: ", departmentData)
            department_tbody.innerHTML = ``

            data.forEach(element => {
                department_tbody.innerHTML +=
                    `    <tr id="department_${element.id}">
                                <td>${element.id}</td>
                                <td>${element.name}</td>
                                <td>${element.description}</td>
                                <td>
                                    <button onclick='delete_department("${element.id}")'>Xóa phòng ban</button>
                                    <button type="button" onclick='pre_edit_department("${element.id}", "${element.name}", "${element.description}")'>Sửa phòng ban</button>
                                </td>
                            </tr>`

                new_employee_department.innerHTML +=
                    `<option value="${element.name}">${element.name}</option>`
            })
        })
        .catch(err => console.log("Gap loi: ", err))

}

show_all_departments()



delete_department = (id) => {
    fetch(`http://localhost:8080/departments/${id}`, {
        method: "DELETE"
    })
        .then(response => {
            if (response.ok) {
                alert("Xóa phòng ban thành công!")
                show_all_departments()
            }
        })
        .catch(err => console.log(err))
}

pre_edit_department = (id, name, description) => {
    row_edit_department = document.getElementById(`department_${id}`)

    row_edit_department.innerHTML =
        `   <td>${id}</td>
            <td><input type="text" id="department_name_update" value="${name}"></td>
            <td><input type="text" id="department_description_update" value="${description}"></td>
            <td>
                <button onclick='cancel_edit_department()'>Hủy</button>
                <button  onclick='edit_department("${id}")'>OK</button>
            </td>`
}

edit_department = (id) => {
    new_department_name = document.getElementById("department_name_update").value;
    new_department_description = document.getElementById("department_description_update").value;

    new_department_data = {
        name: new_department_name,
        description: new_department_description
    }

    console.log("Thông tin cập nhật phòng ban: ", new_department_data)

    fetch(`http://localhost:8080/departments/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(new_department_data)
    })
        .then(response => {
            if (response.ok) {
                alert("Cập nhật phòng ban thành công");
                show_all_departments()
            }
        })
        .catch(arr => console("Gap loi: ", err))
}

cancel_edit_department = () => {
    show_all_departments()
}

add_new_department = () => {
    new_department_name = document.getElementById("new_department_name").value;
    new_department_description = document.getElementById("new_department_description").value;
    new_department_id = document.getElementById("new_department_id").value;
    new_department_data = {
        id: new_department_id,
        name: new_department_name,
        description: new_department_description
    }

    console.log("Thông tin phòng ban mới: ", new_department_data)

    fetch("http://localhost:8080/departments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(new_department_data)
    })
        .then(response => {
            if (response.ok) {
                alert("Thêm phòng ban thành công")
                show_all_departments()
            }
        })
        .catch(err => console.log("Gap loi: ", err))
}

