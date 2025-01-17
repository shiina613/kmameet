

pre_edit_member = (id_member) => {
    const member_role = document.getElementById(`member_role_${id_member}`);
    member_role.innerHTML = `<select id="select_role_${id_member}">
        </select>`
    const list_select_roles = document.getElementById(`select_role_${id_member}`)

    member_all_roles.forEach(element => {
        list_select_roles.innerHTML +=
            `
        <option value="${element.name}">${element.name}</option>
    `})

    const button_box = document.getElementById(`member_button_${id_member}`)
    const role = document.getElementById(`select_role_${id_member}`).value;
    button_box.innerHTML = `<button type="button" onclick='cancel("${id_member}")'>Hủy</button> <button type="button" onclick='edit_member("${id_member}")'>OK</button>`

}

edit_member = (id_member) => {
    const role_edit = document.getElementById(`select_role_${id_member}`).value;
    if (role_edit) {
        console.log(id_member, id_edit_meeting, role_edit)
        fetch(`http://localhost:8080/members/${id_edit_meeting}/${id_member}/role?newRole=${role_edit}`, {
            method: "PUT"
        })
            .then(response => {
                if (response.ok) {
                    showInfo()
                }
            })
            .catch(err => console.log(err))
    } else {
        alert("Xin vui lòng chọn chức danh")
    }
}

delete_member = (id_member) => {
    fetch(`http://localhost:8080/members/${id_edit_meeting}/${id_member}`, {
        method: "DELETE"
    })
        .then(response => {
            if (response.ok) {
                showInfo()
            }
        })
}


pre_add_member = async () => {
    console.log("Meeting info: ", meeting_information)

    //getAllEmployee
    document.getElementById("show_add_button").style.display = "none";
    document.getElementById("add_new_member").style.display = "block";
    await fetch("http://localhost:8080/employees/infor")
        .then(response => response.json())
        .then(data => {

            employees_information = data;
            console.log("Lấy thông tin member thành công: ", employees_information)
            not_member = employees_information.filter(employee => {
                return !members_infomation.some(member => member.idMember === employee.idEmployee);
            });
            console.log("Not member: ", not_member)

        })
}
show_add_button = () => {
    document.getElementById("show_add_button").style.display = "block";
    document.getElementById("add_new_member").style.display = "none";
}

const searchBox = document.getElementById("searchBox");
// suggest.addEventListener("input", (event) => {
//     handleSearch(`${event.value}`)
// })


function handleSearch(query) {
    const suggestions = document.getElementById("suggestions");
    suggestions.innerHTML = ""; // Clear previous suggestions

    if (!query) return; // Exit if query is empty

    const filteredEmployees = not_member.filter(employee =>
        employee.name.toLowerCase().includes(query.toLowerCase())
    );

    filteredEmployees.forEach(employee => {
        const li = document.createElement("li");
        li.textContent = `${employee.name} - ${employee.idEmployee} - ${employee.department}`;
        li.onclick = async () => {
            search.innerHTML = `
                <input type="text" id="searchBox" placeholder="Search by name..."
                oninput="handleSearch(this.value)" data-id ="${employee.idEmployee}" value = " ${employee.name}" />`
            selected_new_member = document.getElementById("searchBox");
            selected_new_id = selected_new_member.dataset.id;
            console.log(selected_new_id)

        };
        suggestions.appendChild(li);
    });
}


function add_member() {


    const id = document.getElementById("searchBox").value;
    const role = document.getElementById("new_member_role").value;

    const addData = [{
        idMember: selected_new_id,
        roleName: role
    }]
    document.getElementById("searchBox").value = ``
    console.log(addData)
    fetch(`http://localhost:8080/meetings/${id_edit_meeting}/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(addData)
    })
        .then(response => response.text())
        .then(data => {
            console.log(data)
            showInfo()
        })
        .catch(err => console.log("gap loi: ", err))
}