const room__Id = localStorage.getItem("meeting");
console.log(room__Id)
showInfo = () => {
    fetch(`http://localhost:8080/meetings/meeting-id/${room__Id}`)
        .then(response => response.json())
        .then(data => {
            console.log("Get meeting respone: ", data)
            meeting_information = data;
            members_infomation = data.members;
            showMember(members_infomation)
            console.log("Member information: ", members_infomation)
            meeting_information_h1.innerHTML = `Thông tin về ${data.name}`
            meeting_name.innerHTML = `${data.name}`;
            meeting_rememberCode.innerHTML = `${data.rememberCode}`;
            meeting_startTime.innerHTML = `${data.startTime}`;
            meeting_expectedEndTime.innerHTML = `${data.expectedEndTime}`;
            meeting_department.innerHTML = `${data.department}`;
            meeting_room.innerHTML = `${data.room}`;
            console.log("Lấy dữ liệu về cuộc họp thành công")
        })
        .catch(err => console.log("Gặp lỗi : ", err))
}
showInfo()
showMember = (data) => {
    meeting_member_tbody.innerHTML = ``
    data.forEach(element => {
        meeting_member_tbody.innerHTML +=
            `<tr>
            <td>${element.name}</td>
            <td>${element.idMember}</td>
            <td id="member_role_${element.idMember}">${element.role}</td>
            <td id="member_button_${element.idMember}">
            <button type="button" onclick='delete_member("${element.idMember}")'>Xóa</button>
            <button type="button" onclick='pre_edit_member("${element.idMember}")'>Chỉnh sửa</button>
            </td>
        </tr>`
    })

}

cancel = (id_member) => {
    const member_role_box = document.getElementById(`member_role_${id_member}`)
    const member_button_box = document.getElementById(`member_button_${id_member}`)
    const role = members_infomation.find(element => element.idMember === `${id_member}`)
    member_role_box.innerHTML = `${role.role}`
    member_button_box.innerHTML = `            <button type="button" onclick='delete_member("${id_member}")'>Xóa</button>
            <button type="button" onclick='pre_edit_member("${id_member}")'>Chỉnh sửa</button>`
}

fetch("#getDocument")
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            meeting_document_information.innerHTML += `<a href="${element.path}">${element.name}</a> <span>, </span>`
        })
    })


// fetch("#getMember")
//     .then(response => response.json())
//     .then(data => {
//         members_infomation = data;
//         data.forEach(element => {
//             const role = role_data.find(item => item.name = element.role);
//             const id_role = role.id;
//             meeting_member_tbody.innerHTML += `
//             <tr id="information_member_${element.id}" data-id="${element.id}">
//                 <td>${element.name}</td>
//                 <td>${element.id}</td>
//                 <td id="member_role_${element.id}">${element.role}</td>
//                 <td id="member_button_${element.id}"><button type="button" onclick = "delete_member(${element.id})">Xóa</button><button type = " button" action ="pre_edit_member(${element.id})">Chỉnh sửa</button></td>
//             </tr>`
//         })
//     })
//     .catch(err => console.log("Gặp lỗi: ", err))

fetch("http://localhost:8080/roles")
    .then(response => response.json())
    .then(data => {
        member_all_roles = data;
        data.forEach(element => {
            new_member_role.innerHTML += `<option value= "${element.name}">${element.name}</option>`
        })
    })