const account_tbody = document.getElementById("account_tbody");

show_all_account = () => {
    fetch("http://localhost:8080/employees", {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            console.log("account data: ", data)
            data.forEach(element => {
                account_tbody.innerHTML +=
                    `       <tr>
                                <td>${element.idEmployee}</td>
                                <td>${element.username}</td>
                                <td>${element.name}</td>
                                     <td><button type="button" onclick='resetPassword("${element.idEmployee}")'>Đặt lại mật khẩu</button></td>
                            </tr>`
            })

        })
        .catch(err => console.log("Gap loi: ", err))
}


show_all_account()

resetPassword = (id_employee) => {
    fetch(`http://localhost:8080/accounts/reset-password/${id_employee}`, {
        method: "POST"
    })
        .then(response => {
            if (response.ok) {
                alert("Đặt lại mật khẩu thành công!")
            }
        })
        .catch(err => console.log("Gặp lỗi khi đặt lại mật khẩu: ", err))
}