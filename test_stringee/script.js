

const PROJECT_ID = "SK.0.PIJAmccnkQ3Z89R9kE3pDQai3urozE5X";
const PROJECT_SECRET = "OW1nZmtIYTdRcWZHbVBBb041a3ZHaUowaWE3YkpESXU=";
//room-vn-1-I8VPX8F4YA-1736290962030
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

const user_id = localStorage.getItem("user_id")
const id_meeting = localStorage.getItem("id_meeting")
const roomId = localStorage.getItem("id_stringee")
const api = new API(PROJECT_ID, PROJECT_SECRET);
let user_position;
fetch(`http://localhost:8080/members/${user_id}/${id_meeting}`, {
    method: "GET"
})
    .then(response => user_position = response.text())
    .catch(err => console.log("Gặp lỗi trong quá trình load chức danh: ", err))

const videoContainer = document.getElementById("videos");



const room_Data = {
    userToken: "",
    roomId: roomId,
    roomToken: "",
    room: undefined,
    callClient: undefined,
    isMicMuted: false,
    localTrack: undefined
}

roomUrl = () => {
    return `Đây là room URL: bla bla bla `
}

join = async () => {
    const roomToken = await api.getRoomToken(room_Data.roomId);
    room_Data.roomToken = roomToken;

    await authen();
    await publish();
    return room_Data.room;
}

joinWithId = async () => {
    const roomId = prompt("Nhập Room Id để tham gia cuộc họp!");
    if (roomId) {
        room_Data.roomId = roomId;
        await join();
    }
}

mounted = async () => {
    console.log("dang mount")
    api.setRestToken();

    if (roomId) {
        room_Data.roomId = roomId;
        await join();
    }
}

mounted()

authen = () => {
    return new Promise(async resolve => {
        const userId = `nguyen_quang_tung-Chu_toa`;
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

    room_Data.localTrack = localTrack;

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
            console.log("Nhan duoc su kien add track: ", track)

            if (track.serverId === localTrack.serverId) {
                console.log("local");
                return;
            }
            subscribe(track);
        });
        room.on("removetrack", e => {
            const track = e.track;
            console.log("Nhan duoc su kien remove track: ", track)
            if (!track) {
                return;
            }

            const mediaElements = track.detach();
            mediaElements.forEach(element => element.remove());
        });

        room.on("message", (message) => {
            const { type, userId, isMicMuted } = message;
            console.log("Da lang nghe duoc su kien message!", message)
            if (type === "mic-status") {
                const action = isMicMuted ? "tắt mic" : "bật mic";
                console.log(`Người dùng ${userId} đã ${action}.`);
            }
        });
        roomData.listTracksInfo.forEach(info => subscribe(info));
    }

    await room.publish(localTrack);
    console.log("Publish thành công");
}

createRoom = async () => {
    const room = await api.createRoom();
    const { roomId } = room;
    const roomToken = await api.getRoomToken(roomId);

    room_Data.roomId = roomId;
    room_Data.roomToken = roomToken;
    console.log("Thông tin phòng vừa tạo: ", { roomId, roomToken });

    await authen();
    await publish();
}


subscribe = async (trackInfo) => {
    const track = await room_Data.room.subscribe(trackInfo.serverId);
    track.on("ready", () => {
        const videoElement = track.attach();
        addVideo(videoElement);
    });
}

addVideo = (video) => {
    video.setAttribute("controls", "true");
    video.setAttribute("playsinline", "true");
    videoContainer.appendChild(video);
}



// Thoát phòng
const leaveRoom = () => {
    if (room_Data.room) {
        room_Data.room.leave();
        alert("Bạn đã thoát cuộc họp.");
        // Xóa video và reset trạng thái
        videoContainer.innerHTML = '';
        room_Data.room = undefined;
    } else {
        alert("Bạn không ở trong phòng nào.");
    }
};

// Kết thúc phòng
const endRoom = async () => {
    if (room_Data.roomId) {
        const confirmEnd = confirm("Bạn có chắc chắn muốn kết thúc cuộc họp không?");
        if (confirmEnd) {
            await api.deleteRoom(room_Data.roomId);
            alert("Cuộc họp đã được kết thúc.");
            // Xóa video và reset trạng thái
            videoContainer.innerHTML = '';
            room_Data.room = undefined;
        }
    } else {
        alert("Không có phòng nào để kết thúc.");
    }
};


// room-vn-1-I8VPX8F4YA-1736290963557

init = () => {
    const button = document.getElementById("buttons-container");
    if (user_position === "Thư ký") {
        button.innerHTML = ``
        //Thêm nút bắt đầu cuộc họp
        button.innerHTML +=
            `<button class="button  is-medium" id="btnStart" onclick="startMeeting()">
            <span id="mic">Bắt đầu cuộc họp</span>
            </button>`
        //Thêm nút bật tắt mic
        button.innerHTML +=
            ` <button class="button  is-medium" id="btnToggle" onclick="toggleMic()">
            <span id="mic">Mic đang tắt</span>
        </button>`
        //Thêm nút chia sẻ màn hình
        button.innerHTML +=
            `  <button class="button  is-medium" id="btnShare" onclick="publish(true)">
                <span>Share Desktop</span>
            </button`

        //Thêm nút tắt mic thành viên
        button.innerHTML +=
            `<button class="button  is-medium" id="btnOff" onclick="requestTurnMicOff()">
                <span>Tắt mic thành viên</span>
            </button>`

    } else {
        //Thêm nút bật/tắt mic
        button.innerHTML = ``;
        button.innerHTML +=
            `<button class="button  is-medium" id="btnToggle" onclick="toggleMic()">
            <span id="mic">Mic đang tắt</span>
        </button>`
        //Thêm nút chia sẻ màn hình
        button.innerHTML +=
            `  <button class="button  is-medium" id="btnShare" onclick="publish(true)">
            <span>Share Desktop</span>
        </button`
        //Thêm nút thoát cuộc họp
        button.innerHTML +=
            ` <button class="button  is-medium" id="btnOut" onclick="leaveRoom()">
                <span>Thoát cuộc họp</span>
            </button>`
    }
}

startMeeting = () => {
    fetch(`http://localhost:8080/meetings/${id_meeting}/dangdienra`, {
        method: "PUT"
    })
        .then(response => {
            if (response.ok) {
                const button = document.getElementById("buttons-container");
                button.innerHTML +=
                    `<button class="button  is-medium" id="btnEnd" onclick="endRoom()">
                    <span>Kết thúc cuộc họp</span>
                </button>`
                document.getElementById("btnStart").remove();
            }
        })
        .catch(err => console.log("Gap loi khi bat dau cuoc hop: ", err))
}

init()

changeMicStatus = () => {

}

toggleMic = () => {
    if (user_position === "Thư ký") {
        //Mic thư ký
        toggleSecretaryMic()
    } else {
        //Mic thành viên
        toggleMemberMic()
    }
}

let micRecorder;
let micAudio = [];
let count = 1;

toggleSecretaryMic = async () => {
    //Chức năng bật/tắt mic của thư lý
    const localTrack = room_Data.localTrack;
    if (room_Data.isMicMuted) {
        //Mic đang mute => Bật mic

        localTrack.mute(false)
        document.getElementById("mic").innerHTML = "Mic đang bật"
        room_Data.isMicMuted = false;
        room_Data.room.sendMessage({
            action: "member_on",
            user: `${user_name}`,
            role: `${user_role}`
        })

        try {
            const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            micRecorder = new MediaRecorder(micStream);

            micRecorder.ondataavailable = event => {
                micAudio.push(event.data)
            };

            micRecorder.onstop = async () => {
                const micBlob = new Blob(micAudio, { type: 'audio/wav' });
                micAudio = [];

                const micData = new FormData();
                micData.append('audio', micBlob, `${count}-${user_name}-${user_role}.wav`);
                count += 1;
                micData.append('user_name', user_name);
                micData.append('user_role', user_role)

                fetch(`http://localhost:8080/audio/uploads/${r - code}`, {
                    method: "POST",
                    body: micData
                })
                    .catch(err => {
                        console.log("Gap loi: ", err)
                    })
            };

            micRecorder.start();
        } catch (err) {
            console.error("Gap loi :", err)
        }

    } else {
        //Mic đang bật => Tắt mic
        localTrack.mute(true)
        document.getElementById("mic").innerHTML = "Mic đang tắt"
        room_Data.isMicMuted = true;
        room_Data.room.sendMessage({
            action: "member_off",
            user: `${user_name}`,
            role: `${user_role}`
        })
        micRecorder.stop()

    }
}

toggleMemberMic = () => {
    //Chức năng bật/tắt mic của thành viên
    const localTrack = room_Data.localTrack;
    if (room_Data.isMicMuted) {
        //Mic đang mute => Bật mic
        localTrack.mute(false);
        document.getElementById("mic").innerHTML = "Mic đang bật"
        room_Data.isMicMuted = false;
        //Gửi message thông báo hành vi bật mic => disable mic của các thành viên còn lại
        room_Data.room.sendMessage({
            action: "member_on",
            user: `${user_name}`,
            role: `${user_role}`
        })
    } else {
        //Mic đang bật => Tắt mic
        localTrack.mute(true)
        document.getElementById("mic").innerHTML = "Mic đang tắt"
        room_Data.isMicMuted = true;
        //Gửi message thông báo hành vi tắt mic => khôi phục các chức năng mic 
        room_Data.room.sendMessage({
            action: "member_off",
            user: `${user_name}`,
            role: `${user_role}`
        })

    }
}


requestTurnMicOff = (t) => {
    //Thư ký tắt mic của thành viên
    room_Data.room.sendMessage({
        action: "off"
    }).then(() => {
        alert("Tắt mic thành viên thành công")
    }).catch((error) => {
        console.log("Gặp lỗi khi yêu cầu tắt mic:", error)
        alert("Gặp lỗi")
    });
};


receiveMessage = (msg) => {

    if (msg.action === "off" && room_Data.room.isMicMuted === false) {
        toggleMemberMic()
    } else {
        if (user_role === "Thư ký") {
            //Chuyển đến chức năng của thư ký
            secretaryReceiveMessage(msg)
        } else {
            //Chuyển đến chức năng của thành viên cuộc họp
            memberReceiveMessage(msg.action)
        }
    }


}

memberReceiveMessage = (action) => {

    //Nếu thư ký yêu cầu tắt mic => tắt mic

    //Nếu có người bật/tắt mic => thay đổi trạng thái mic bản thân
    if (action === "member_on") {
        //Nếu có người bật mic => disable mic
        changeMicStatus()
    } else {
        //Người đang bật mic trong phòng tắt mic => enable mic
        changeMicStatus()
    }
}



let mediaRecorder;
let audio = [];
const videosContainer = document.querySelector('.videos')


secretaryReceiveMessage = (msg) => {
    //Thư ký nhận message

    //Nếu có người bật mic =>  disable mic + tạo track audio
    if (msg.action === "member_on") {
        //bắt đầu ghi âm
        try {
            const videoElements = videosContainer.querySelectorAll('video');

            if (videoElements.length === 0) {
                alert("Không có video nào");
                return
            }

            const audioContext = new AudioContext();
            const destination = audioContext.createMediaStreamDestination();

            videoElements.forEach(video => {
                const videoSource = audioContext.createMediaElementSource(video);
                videoSource.connect(destination)
            })

            mediaRecorder = new MediaRecorder(destination.stream);

            mediaRecorder.ondataavailable = event => {
                audio.push(event.data)
            }

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audio, { type: 'audio/wav' })
                audio = []

                //Gửi file âm thanh kèm tên và role của người vừa nói

                const formData = new FormData();
                formData.append('audio', audio, `${count}-${msg.user}-${msg.role}`);
                formData.append('user', user);
                formData.append('role', role);

                fetch(`http://localhost:8080/audio/uploads/${remember - code}`, {
                    method: "POST",
                    body: formData
                })
                    .catch(err => {
                        console.log("Gap loi khi luu audio: ", err)
                    })

                mediaRecorder.start()
            }
        } catch (err) {
            console.log("Fail: ", err)
        }

    } else {
        changeMicStatus(msg.name, msg.role)
        //Lưu track audio
        mediaRecorder.stop()
    }

}
