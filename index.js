const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://8tambola.netlify.app/"
    }
});

const ids = new Set();
io.on('connection',
    socket => {
        socket.on("random-number", (num, roomId) => {
            socket.to(roomId).emit("recieve-random-number", num);
        })
        socket.on("Create-room", roomId => {
            console.log("create-room" + roomId);
            const g = ids.has(roomId)
            if (g == false) {
                ids.add(roomId);
                socket.join(roomId);
            }
            console.log(ids);
            if (g == false) {
                console.log(1);
                socket.emit("Room Already Created", "Joined Room");
            }
            else {
                console.log(2);
                socket.emit("Room Already Created", "Room Already Created");
            }
            console.log(ids);
        })
        socket.on("join-room", roomId => {
            // console.log(roomId);
            if (ids.has(roomId))
                socket.join(roomId);
            if (ids.has(roomId)) {
                socket.emit("Error", "Joined Room");
            }
            else {
                socket.emit("Error", "Incorrect RoomId");
            }
        })
        socket.on("delete-room", roomId => {
            console.log(ids);
            ids.delete(roomId);
            console.log(ids);
            console.log("Entered Delete");
        })
        socket.on("leave-room", roomId => {
            console.log("Entered leave");
            socket.leave(roomId);
        })
        socket.on("Full-House", (no, roomId) => {
            console.log("Entered houseFull");
            socket.to(roomId).emit("full-house-done", no);
        })
        socket.on("Row-1", (no, roomId) => {
            console.log("Row 1 Done");
            socket.to(roomId).emit("row-1-done", no);
        })
        socket.on("Row-2", (no, roomId) => {
            console.log("Row 2 Done");
            socket.to(roomId).emit("row-2-done", no);
        })
        socket.on("Row-3", (no, roomId) => {
            console.log("Row 3 Done");
            socket.to(roomId).emit("row-3-done", no);
        })
    })


server.listen(4567, () => {
    console.log("SERVER IS RUNNING");
});