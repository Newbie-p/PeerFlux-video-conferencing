import { Server } from "socket.io"


let connections = {}
let messages = {}
let timeOnline = {}

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });


    io.on("connection", (socket) => {

        console.log("New socket connected:", socket.id)

        socket.on("join-call", (meetingCode) => {

            console.log(`User ${socket.id} joining meeting: ${meetingCode}`)

            if (connections[meetingCode] === undefined) {
                connections[meetingCode] = []
            }
            connections[meetingCode].push(socket.id)

            // Join socket to a room based on meeting code
            socket.join(meetingCode)

            timeOnline[socket.id] = new Date();

            // Notify all users in this meeting that a new user joined
            for (let a = 0; a < connections[meetingCode].length; a++) {
                io.to(connections[meetingCode][a]).emit("user-joined", socket.id, connections[meetingCode])
            }

            // Send previous messages to the new user
            if (messages[meetingCode] !== undefined) {
                for (let a = 0; a < messages[meetingCode].length; ++a) {
                    io.to(socket.id).emit("chat-message", messages[meetingCode][a]['data'],
                        messages[meetingCode][a]['sender'], messages[meetingCode][a]['socket-id-sender'])
                }
            }

            console.log(`Current users in meeting ${meetingCode}:`, connections[meetingCode])

        })

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        })

        socket.on("chat-message", (data, sender) => {

            const [matchingRoom, found] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, roomValue]) => {


                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }

                    return [room, isFound];

                }, ['', false]);

            if (found === true) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = []
                }

                messages[matchingRoom].push({ 'sender': sender, "data": data, "socket-id-sender": socket.id })
                console.log("message", matchingRoom, ":", sender, data)

                connections[matchingRoom].forEach((elem) => {
                    io.to(elem).emit("chat-message", data, sender, socket.id)
                })
            }

        })

        socket.on("disconnect", () => {

            var diffTime = Math.abs(timeOnline[socket.id] - new Date())

            var key

            for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {

                for (let a = 0; a < v.length; ++a) {
                    if (v[a] === socket.id) {
                        key = k

                        for (let a = 0; a < connections[key].length; ++a) {
                            io.to(connections[key][a]).emit('user-left', socket.id)
                        }

                        var index = connections[key].indexOf(socket.id)

                        connections[key].splice(index, 1)


                        if (connections[key].length === 0) {
                            delete connections[key]
                        }
                    }
                }

            }


        })


    })


    return io;
}