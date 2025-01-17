localStorage.clear()

getName = (token) => {
    fetch("http://localhost:8080/accounts/info", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {

            localStorage.setItem("user_name", data.name)
            localStorage.setItem("user_position", data.position)
            localStorage.setItem("user_id", data.id)
            if (data.position === "Admin") {
                window.location.href = "http://127.0.0.1:5500/src/admin/admin.html"
            }
        })
        .catch(err => console.log("gap loi: ", err))
}

login = () => {
    const username = document.getElementById("login_username").value;
    const password = document.getElementById("login_password").value;

    if (!username || !password) {
        alert("Vui lòng nhập đầy đủ thông tin đăng nhập!");
        return
    }
    const loginData = {
        username: username,
        password: password
    }

    fetch("http://localhost:8080/accounts/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    })
        .then(response => {
            if (response.ok) {
                return response.text()
            }
            return response.text().then(errorMessage => {
                throw new Error(errorMessage);  // Đợi response.text() và ném lỗi với thông điệp
            });
        })
        .then(async (data) => {
            alert("Đăng nhập thành công!")
            localStorage.setItem("user_token", data)
            await getName(data)
            window.location.href = "http://127.0.0.1:5500/src/home/home.html"

        })
        .catch(err => alert(err.message))
}