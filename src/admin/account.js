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
                                <td>${element.id}</td>
                                <td>${element.username}</td>
                                <td>${element.password}</td>
                                <td>${element.name}</td>
                            </tr>`
            })

        })
        .catch(err => console.log("Gap loi: ", err))
}


show_all_account()