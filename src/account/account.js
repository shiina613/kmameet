const user_token = localStorage.getItem("user_token")
console.log(user_token)

show = () => {
    document.getElementById("changePassword").style.display = "none"
    fetch("http://localhost:8080/accounts/info", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${user_token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            document.getElementById("name").value = data.name;
            document.getElementById("id").value = data.id;
            document.getElementById("dob").value = data.dob;
            if (data.phoneNumber)
                document.getElementById("phoneNumber").value = data.phoneNumber;
            if (data.address)
                document.getElementById("address").value = data.address;
            document.getElementById("degree").value = data.degree;
            document.getElementById("position").value = data.position;
            document.getElementById("department").value = data.department;
            if (data.workplace)
                document.getElementById("workplace").value = data.workplace;
            if (data.email)
                document.getElementById("email").value = data.email;
            if (data.bankAccount)
                document.getElementById("bankAccount").value = data.bankAccount;
            if (data.bank)
                document.getElementById("bank").value = data.bank;
        })
        .catch(err => console.log("Gap loi: ", err))

}

show()
update = () => {
    const phoneNumber = document.getElementById("phoneNumber").value;
    const address = document.getElementById("address").value;
    const workplace = document.getElementById("workplace").value;
    const bankAccount = document.getElementById("bankAccount").value;
    const bank = document.getElementById("bank").value;
    const email = document.getElementById("email").value;

    const update_data = {
        phoneNumber: phoneNumber,
        address: address,
        email: email,
        workplace: workplace,
        bank: bank,
        bankAccount: bankAccount,
    }

    console.log(update_data)

    fetch("http://localhost:8080/employees/update-profile", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user_token}`
        },
        body: JSON.stringify(update_data)
    })
        .then(response => {
            if (response.ok) {
                alert("Cập nhật thành công")
                cancel()
            } else {
                console.log(response)
            }
        })
        .catch(err => console.log("Gặp lỗi: ", err))
}



preChangePassword = () => {
    document.getElementById("info").style.display = "none"
    document.getElementById("changePassword").style.display = "block"
}

changePassword = () => {
    const username = document.getElementById("id").value;
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const repeatPassword = document.getElementById("repeatPassword").value;

    if (newPassword !== repeatPassword) {
        alert("Mật khẩu không khớp")
        return
    }

    const data = {
        oldPassword: oldPassword,
        newPassword: newPassword
    }

    fetch("http://localhost:8080/accounts/change-password", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${user_token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                alert("Đổi mật khẩu thành công!")
            }
        })
        .catch(err => {
            console.log("Có lỗi xảy ra khi đổi mật khẩu: ", err)

        })

}

cancel = () => {
    document.getElementById("info").style.display = "block"
    document.getElementById("changePassword").style.display = "none"
}