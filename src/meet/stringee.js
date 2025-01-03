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



const room_Data = {
    userToken: "",
    roomId: "",
    roomToken: "",
    room: undefined,
    callClient: undefined
}

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
    alert("Them path")
    const room = await api.createRoom();
    console.log(room)
    alert("Vua tao xong room, bat dau them")
}

