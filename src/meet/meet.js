var meeting_member;
var employees;
/////////////////
//Tùng
const PROJECT_ID = "SK.0.A39px7Rx6cqcYOHnsoHzsvWOBm8qoSB";
const PROJECT_SECRET = "SnRxVzI4T0dKWmZoR2w5UE5jRWtuc25hVWtBWDhSSWk=";


//Dương
// const PROJECT_ID = "SK.0.kOO5XpZJFdHHQVvAH5GY34cY5KWjQbRu";
// const PROJECT_SECRET = "djFVdXVoQk42Wk1EdlpvODNwNWNRNnR3V0xRcDE4";

const BASE_URL = "https://api.stringee.com/v1/room2";

class API {
    constructor(projectId, projectSecret) {
        this.projectId = projectId;
        this.projectSecret = projectSecret;
        this.restToken = "";
    }

    async createRoom() {
        const roomName = Math.random().toFixed(4);
        const response = await axios.post(
            `${BASE_URL}/create`,
            {
                name: roomName,
                uniqueName: roomName
            },
            {
                headers: this._authHeader()
            }
        );

        const room = response.data;
        console.log({ room });
        return room;
    }

    async listRoom() {
        const response = await axios.get(`${BASE_URL}/list`, {
            headers: this._authHeader()
        });

        const rooms = response.data.list;
        console.log({ rooms });
        return rooms;
    }

    async deleteRoom(roomId) {
        const response = await axios.put(`${BASE_URL}/delete`, {
            roomId
        }, {
            headers: this._authHeader()
        })

        console.log({ response })

        return response.data;
    }

    async clearAllRooms() {
        const rooms = await this.listRoom()
        const response = await Promise.all(rooms.map(room => this.deleteRoom(room.roomId)))

        return response;
    }

    async setRestToken() {
        const tokens = await this._getToken({ rest: true });
        const restToken = tokens.rest_access_token;
        this.restToken = restToken;

        return restToken;
    }

    async getUserToken(userId) {
        const tokens = await this._getToken({ userId });
        return tokens.access_token;
    }

    async getRoomToken(roomId) {
        const tokens = await this._getToken({ roomId });
        return tokens.room_token;
    }

    async _getToken({ userId, roomId, rest }) {
        const response = await axios.get(
            "https://v2.stringee.com/web-sdk-conference-samples/php/token_helper.php",
            {
                params: {
                    keySid: this.projectId,
                    keySecret: this.projectSecret,
                    userId,
                    roomId,
                    rest
                }
            }
        );

        const tokens = response.data;
        console.log({ tokens });
        return tokens;
    }

    isSafari() {
        const ua = navigator.userAgent.toLowerCase();
        return !ua.includes('chrome') && ua.includes('safari');
    }

    _authHeader() {
        return {
            "X-STRINGEE-AUTH": this.restToken
        };
    }
}

const api = new API(PROJECT_ID, PROJECT_SECRET);

const videoContainer = document.getElementById("videos");


mounted = async () => {
    console.log("dang mount")
    api.setRestToken();
}

mounted()

authen = () => {
    return new Promise(async resolve => {
        const userId = `${(Math.random() * 100000).toFixed(6)}`;
        const userToken = await api.getUserToken(userId);

        room_Data.userToken = userToken;

        if (!room_Data.callClient) {
            const client = new StringeeClient();

            client.on("authen", function (res) {
                console.log("on authen: ", res);
                resolve(res);
            });
            room_Data.callClient = client;
        }
        room_Data.callClient.connect(userToken);
    });
}

publish = async (screenSharing = false) => {
    const localTrack = await StringeeVideo.createLocalVideoTrack(
        room_Data.callClient,
        {
            audio: true,
            video: true,
            screen: screenSharing,
            videoDimensions: { width: 640, height: 360 }
        }
    );

    const videoElement = localTrack.attach();
    addVideo(videoElement);

    const roomData = await StringeeVideo.joinRoom(
        room_Data.callClient,
        room_Data.roomToken
    );
    const room = roomData.room;
    console.log({ roomData, room });

    if (!room_Data.room) {
        room_Data.room = room;
        room.clearAllOnMethos();
        room.on("addtrack", e => {
            const track = e.info.track;

            console.log("addtrack: ", track);
            if (track.serverId === localTrack.serverId) {
                console.log("local");
                return;
            }
            subscribe(track);
        });
        room.on("removetrack", e => {
            const track = e.track;
            if (!track) {
                return;
            }

            const mediaElements = track.detach();
            mediaElements.forEach(element => element.remove());
        });

        roomData.listTracksInfo.forEach(info => subscribe(info));
    }

    await room.publish(localTrack);
    console.log("room puslish successful");
}

createRoom = async (id_meeting) => {
    console.log("Create room:", id_meeting)
    alert("Them path")
    const room = await api.createRoom();
    console.log(room)
    localStorage.setItem("roomID_stringee", room.roomId)
    alert("Vua tao xong room, bat dau them")


}

/////////////////


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
                let id_new_meeting = await response.text();
                console.log(id_new_meeting)
                alert("Tao cuoc hop thanh cong")
                console.log("Tao cuoc hop thanh cong, dang chueyn sang buoc them thanh vien")
                await addMember(id_new_meeting)
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

    fetch(`http://localhost:8080/meetings/${id_meeting}/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(selectedMember)
    })
        .then(response => {
            if (response.ok) {
                alert("Them thanh vien vao cuoc hop thanh cong")
                addDocument(id_meeting)
            }
        })
        .catch(err => console.log("Gap loi: ", err))
}


const fileInput = document.getElementById('file-in');
const fileList = document.getElementById('file-list');

// Lắng nghe sự kiện khi người dùng chọn file
fileInput.addEventListener('change', function () {
    // Xóa danh sách tài liệu trước đó
    console.log("Nhan duoc file")
    fileList.innerHTML = '';

    // Lặp qua từng file đã chọn và thêm vào danh sách
    Array.from(fileInput.files).forEach((file, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${file.name}`;
        fileList.appendChild(listItem);
    });
});


addDocument = async (id_meeting) => {
    alert("Day la buoc add document")

    const fileInput = document.getElementById("file-in");
    const formData = new FormData();

    // Lặp qua tất cả các file được chọn và thêm vào formData
    for (const file of fileInput.files) {
        formData.append("files", file);
    }

    try {
        const response = await fetch(`http://localhost:8080/documents/upload/${id_meeting}`, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            alert("Upload thành công:", result);
        } else {
            alert("Lỗi khi upload:", response.statusText);
        }
    } catch (error) {
        console.log("Bat loi: ", error)
        console
        alert("Lỗi khi kết nối đến server:", error);
    }

    alert("Ket thuc")
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