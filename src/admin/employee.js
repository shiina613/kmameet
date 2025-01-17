const employee_tbody = document.getElementById("employee_tbody");
show_employee = () => {
    fetch("http://localhost:8080/employees", {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            employeeData = data;
            console.log("Thông tin nhân viên:", employeeData)
            employee_tbody.innerHTML = ``
            data.forEach(element => {
                employee_tbody.innerHTML +=
                    `   <tr id="tr_${element.idEmployee}">
                        <td>${element.idEmployee}</td>
                        <td>${element.name}</td>
                        <td>${element.dob}</td>
                        <td>${element.phoneNumber}</td>
                        <td>${element.degree}</td>
                        <td>${element.identification}</td>
                        <td>${element.address}</td>
                        <td>${element.position.name} </td>
                        <td>${element.workplace}</td>
                        <td>${element.bankAccount}</td>
                        <td>${element.bank}</td>
                        <td>${element.department.name}</td>
                        <td>
                            <button type="button" onclick='delete_employee("${element.idEmployee}")'>Xóa</button>
                            <button type="button" onclick='pre_edit_employee("${element.idEmployee}")'>Chỉnh sửa</button>
                        </td>
                    </tr>`
            })
        })
        .catch(err => console.log("Gap loi: ", err))
}
show_employee()

delete_employee = (id) => {
    fetch(`http://localhost:8080/employees/${id}`, {
        method: "DELETE"
    })
        .then(response => {
            if (response.ok) {
                alert("Xoa thanh cong");
                show_employee()
            }
        })
        .catch(err => console.log("Gap loi: ", err))
}

let selected_employee;
let selected_employee_info;
let position_join = ``;
let department_join = ``;

pre_edit_employee = (id) => {
    positionData.forEach(element => {
        position_join += `  <option value="${element.name}">${element.name}</option>`
    })
    departmentData.forEach(element => {
        department_join += `<option value="${element.name}">${element.name}</option>`
    })
    selected_employee_info = employeeData.find(item => item.idEmployee === `${id}`)
    selected_employee = document.getElementById(`tr_${id}`)
    selected_employee.innerHTML =
        `<td><input type="text" value="${selected_employee_info.id}"></td>
        <td><input type="text" value="${selected_employee_info.name}" id="name_edited"></td>
        <td><input type="text" value="${selected_employee_info.dob}" id="dob_edited"></td>
        <td><input type="text" value="${selected_employee_info.phoneNumber}" id="phoneNumber_edited"></td>
        <td><input type="text" value="${selected_employee_info.degree}" id="degree_edited"></td>
        <td><input type="text" value="${selected_employee_info.identification}" id="identification_edited"></td>
        <td><input type="text" value="${selected_employee_info.address}" id="address_edited"></td>
        <td>
            <select id="select_employee_position">
                <option value="">Chọn chức vụ</option>
                ${position_join}
            </select>
        </td>
        <td><input type="text" value="${selected_employee_info.workplace}" id="workplace_edited"></td>
        <td><input type="text" value="${selected_employee_info.bankAccount}" id="bankAccount_edited"></td>
        <td><input type="text" value="${selected_employee_info.bank}" id="bank_edited"></td>
        <td>
            <select id="select_employee_department">
                <option value="">Chọn phòng ban</option>
                ${department_join}
            </select>
        </td>
        <td>
            <button type="button" onclick='cancel_edit_employee()'>Hủy</button>
            <button type="button" onclick='edit_employee("${id}")'>Chỉnh sửa</button>
        </td>`
}


cancel_edit_employee = () => {
    show_employee()
}
edit_employee = (id) => {
    let name_edited = document.getElementById("name_edited").value;
    let dob_edited = document.getElementById("dob_edited").value;
    let phoneNumber_edited = document.getElementById("phoneNumber_edited").value;
    let degree_edited = document.getElementById("degree_edited").value;
    let identification_edited = document.getElementById("identification_edited").value;
    let address_edited = document.getElementById("address_edited").value;
    let workplace_edited = document.getElementById("workplace_edited").value;
    let bankAccount_edited = document.getElementById("bankAccount_edited").value;
    let bank_edited = document.getElementById("bank_edited").value;
    let department_edited = document.getElementById("select_employee_department").value;
    let position_edited = document.getElementById("select_employee_position").value;

    if (!name_edited || !dob_edited || !phoneNumber_edited || !degree_edited || !identification_edited || !address_edited || !workplace_edited || !bankAccount_edited || !bank_edited || !department_edited || !position_edited) {
        alert("Vui lòng điền đầy đủ thông tin");
        return;
    }

    const editData = {
        id: id,
        name: name_edited,
        dob: dob_edited,
        phoneNumber: phoneNumber_edited,
        degree: degree_edited,
        identification: identification_edited,
        address: address_edited,
        workplace: workplace_edited,
        bankAccount: bankAccount_edited,
        bank: bank_edited,
        position: position_edited,
        department: department_edited
    }

    console.log("Edit data: ", editData)
    fetch("http://localhost:8080/employees", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(editData)
    })
        .then(response => response.text())
        .then(data => {
            console.log("Day la data: ", data)
            show_employee
        })
        .catch(err => console.log("Gap loi: ", err))

}
let parts;

add_new_employee = () => {
    new_employee_name = document.getElementById("new_employee_name").value;
    new_employee_idEmployee = document.getElementById("new_employee_idEmployee").value;
    new_employee_department_data = document.getElementById("new_employee_department").value;
    new_employee_position_data = document.getElementById("new_employee_position").value;
    new_employee_degree = document.getElementById("new_employee_degree").value;
    new_employee_dob = document.getElementById("new_employee_dob").value;
    new_employee_dob = new_employee_dob.replace(/-/g, '/');

    parts = new_employee_dob.split('/');
    new_employee_dob = `${parts[2]}/${parts[1]}/${parts[0]}`;

    new_employee_data =
    {
        name: new_employee_name,
        idEmployee: new_employee_idEmployee,
        department: new_employee_department_data,
        position: new_employee_position_data,
        degree: new_employee_degree,
        dob: new_employee_dob
    }
    console.log("Thong tin nhan vien moi: ", new_employee_data)

    fetch("http://localhost:8080/accounts/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(new_employee_data)
    })
        .then(response => {
            if (response.ok) {
                alert("Thêm nhân viên mới thành công!");
                show_employee()
                account_tbody.innerHTML = ``
                show_all_account()
            } else {
                console.log(response.text())
            }
        })
        .catch(err => console.log("Gap loi: ", err))
}

