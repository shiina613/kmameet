var meeting_member;
var employees;
var not_member;



getMember = () => {

}

getEmployees = () => {
    fetch("http://localhost:8080/employees", {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            employees = data;
        })
        .catch(err => console.log("Gap loi: ", err))

}


getRole = () => {

    fetch("http://localhost:8080/roles", {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            let new_member_role = document.getElementById("new_member_role")
            data.forEach(element => {
                new_member_role.innerHTML +=
                    `<option value="${element.name}">${element.name}</option>`
            })
        })
}

getRoom = () => {

    fetch("http://localhost:8080/rooms", {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            let new_meeting_room = document.getElementById("new_meeting_room");
            data.forEach(element => {
                new_meeting_room.innerHTML +=
                    `<option value="${element.name}">${element.name}</option>`;
            })
        })
        .catch(err => console.log("Gap loi: ", err))
}

getDepartment = () => {

    fetch("http://localhost:8080/departments/allnames", {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            let new_meeting_department = document.getElementById("new_meeting_department");
            data.forEach(element => {
                new_meeting_department.innerHTML +=
                    `<option value="${element}">${element}</option>`;
            })
        })
        .catch(err => console.log("Gap loi: ", err))
}


getNeeded = async () => {
    console.log("Ham get Needed")
    await getMember();
    await getEmployees();
    await getRole();
    await getRoom();
    await getDepartment();
}

getNeeded()

createNewMeeting = async () => {
    await create()
}

create = () => {
    let new_meeting_name = document.getElementById("new_meeting_name").value;
    let new_meeting_rememberCode = document.getElementById("new_meeting_rememberCode").value;
    let new_meeting_startTime = document.getElementById("new_meeting_startTime").value;
    let new_meeting_room = document.getElementById("new_meeting_room").value;
    let new_meeting_department = document.getElementById("new_meeting_department").value;

    if (!new_meeting_name || !new_meeting_rememberCode || !new_meeting_startTime || !new_meeting_room || !new_meeting_department) {
        alert("Vui lòng điền đầy đủ thông tin cuộc họp")
        return
    }

    let new_meeting_data = {
        name: new_meeting_name,
        rememberCode: new_meeting_rememberCode,
        startTime: new_meeting_startTime,
        department: new_meeting_department,
        room: new_meeting_room
    }

    console.log("Du lieu tao cuoc hop rong : ", new_meeting_data)

    fetch("http://localhost:8080/meetings/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(new_meeting_data)
    })
        .then(async (response) => {
            if (response.ok) {
                let id_new_meeting = await response.text()
                alert("Tao cuoc hop thanh cong")
                console.log("Tao cuoc hop thanh cong, dang chueyn sang buoc them thanh vien")
                addMember(id_new_meeting)
            }
        })
        .catch(err => console.log("gap loi: ", err))

}

//ADD member

const selected = [];
var selectedEmployee;
var selectedMember = [];
// Hàm tìm kiếm và hiển thị các gợi ý
function showSuggestions() {
    const query = document.getElementById("search_new_member").value.toLowerCase();
    const suggestionsList = document.getElementById("suggestions");

    // Làm sạch danh sách gợi ý trước khi hiển thị kết quả mới
    suggestionsList.innerHTML = "";

    if (query.length > 0) {
        // Tìm kiếm các nhân viên phù hợp
        const filteredEmployees = employees.filter(employee =>
            employee.name.toLowerCase().includes(query)
        );

        // Hiển thị gợi ý
        filteredEmployees.forEach(employee => {
            const li = document.createElement("li");
            li.textContent = `${employee.name} - ${employee.department.name}`;
            li.onclick = () => selectSuggestion(employee); // Khi chọn phần tử, thay đổi ô input và lưu vào mảng selected
            suggestionsList.appendChild(li);
        });
    }
}

// Hàm thay đổi giá trị ô tìm kiếm và lưu suggestion vào mảng selected
function selectSuggestion(employee) {
    // Thay đổi giá trị của ô search box
    document.getElementById("search_new_member").value = employee.name;
    selectedEmployee = employee;

    employees = employees.filter(item => item.idEmployee != selectedEmployee.idEmployee)
    // Xóa gợi ý sau khi chọn
    document.getElementById("suggestions").innerHTML = "";
}

addSelectedMember = () => {
    let new_member_role = document.getElementById("new_member_role").value;
    selected.push({ name: selectedEmployee.name, roleName: new_member_role });
    selectedMember.push({ idMember: selectedEmployee.idEmployee, roleName: new_member_role });
    renderSelectedList()
    document.getElementById("search_new_member").value = "";
    selectedEmployee = null;

}
// Hàm hiển thị danh sách đã chọn
function renderSelectedList() {
    const selectedList = document.getElementById("selected-list");
    selectedList.innerHTML = ""; // Xóa danh sách cũ

    selected.forEach(employee => {
        const li = document.createElement("li");
        li.textContent = `${employee.name} - ${employee.roleName}`; // Chỉ hiển thị name
        selectedList.appendChild(li);
    });
}

addMember = (id_meeting) => {
    console.log(id_meeting)
    alert("Dang o buoc chinh sua member cho cuoc hop : ", id_meeting)
    fetch("http://localhost:8080/meetings/1/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(selectedMember)
    })
        .then(response => {
            if (response.ok) {
                alert("Them thanh vien vao cuoc hop thanh cong")
            }
        })
}

addDocument = () => {

}

document.getElementById("file-in").addEventListener("change", function () {
    const fileList = document.getElementById("file-list");
    fileList.innerHTML = "";

    Array.from(this.files).forEach((file) => {
        const listItem = document.createElement("li");
        listItem.textContent = file.name;
        fileList.appendChild(listItem);
    });
});