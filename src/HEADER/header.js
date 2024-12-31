accountBtn = () => {
    const user_name = localStorage.getItem("user_name")
    const account_btn = document.getElementById("account_btn")
    const account_option = document.getElementById("account_option")
    if (user_name) {
        console.log("Tên người dùng: ", user_name)
        account_btn.innerHTML = `<span>${user_name}</span>`
        account_option.innerHTML =
            `  <li><a href="http://127.0.0.1:5500/src/account/account.html">Thông tin cá nhân</a></li>
              <li><a href="http://127.0.0.1:5500/src/login/index.html">Đăng xuất</a></li>`
    }
    else {
        account_option.innerHTML = ` <li><a href="http://127.0.0.1:5500/src/login/index.html">Đăng nhập</a></li>`
    }
}

accountBtn()