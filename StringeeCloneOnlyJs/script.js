//Tùng
const PROJECT_ID = "SK.0.w2GjUrVudN3YptKazxsFZ8NAoTAbt";
const PROJECT_SECRET = "ZkVNYzg5NnhBMGw0Q0tKNFoxR3A1a3BMbVpON205SXE=";


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
const roomId = localStorage.getItem("id_stringee")
const api = new API(PROJECT_ID, PROJECT_SECRET);

const videoContainer = document.getElementById("videos");



const room_Data = {
    userToken: "",
    roomId: "",
    roomToken: "",
    room: undefined,
    callClient: undefined
}

roomUrl = () => {
    return `Đây là room URL: bla bla bla `
}

join = async () => {
    const roomToken = await api.getRoomToken(room_Data.roomId);
    room_Data.roomToken = roomToken;

    await authen();
    await publish();
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

    await authen()
}



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

mounted()

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