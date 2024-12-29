const form = document.getElementById("form");

signUp = () => {
    const id = document.getElementById("id").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const repeatPassword = document.getElementById("repeatPassword").value;

    if (password === repeatPassword) {
        const registerData = {
            id: id,
            username: username,
            password: password
        }
        register(registerData);
    } else {
        alert("Repeat password is incorrect!")
    }
}

register = (data) => {
    console.log(data)
    fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(respone => respone.text())
        .then(data => {
            if (data === "Đăng ký thành công") {
                alert(data, ", sẽ chuyển hướng về trang đăng nhập!")
                window.location.href = "#login"
            } else {
                alert("Lỗi đăng ký: " + data)
            }
        })
        .catch(err => {
            alert("Gặp lỗi: " + err)
        }
        )
}