const express = require("express");
const cors = require("cors");
const db = require("./models");
const config = require("./config/config");
const socketio = require("socket.io");
const http = require("http");

const {
    User,
    Chat,
    Sequelize
} = require("./models");

const app = express();
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cors());

const server = http.createServer(app);
const io = socketio(server);

const {
    addUser,
    getUser,
    deleteUser
} = require("./users");

const {
    reverse
} = require("dns");

app.use(require("./routes"));

io.on("connection", (socket) => {
    socket.on("joinRoom", (user) => {
        user.id = socket.id;
        addUser(user);

        socket.join(user.room);

        socket.broadcast.to(user.room).emit("messege", {
            sender: "admin",
            body: user.username + " has joined room",
        });
    });

    socket.on("chatMessege", async (data) => {
        const receiver = await User.findOne({
            where: {
                id: data.receiver.id,
            },
        });

        if (receiver.socketId != null) {
            io.to(receiver.socketId).emit("messege", {
                sender: data.sender,
                messege: data.messege,
                receiver: data.receiver,
            });
        }

        console.log(
            "Eziga aydersem ende?"
        );

        Chat.create({
            messege: data.messege,
            senderId: data.sender.id,
            receiverId: data.receiver.id,
        }).then((res) => {
            console.log(res);
        });
    });

    socket.on("user_connected", async (user) => {
        await User.update({
            socketId: socket.id,
        }, {
            where: {
                id: user.id,
            },
        });
    });

    socket.on("user_disconnected", (user) => {
        User.update({
                socketId: null,
            }, {
                where: {
                    id: user.id,
                },
            })
            .then((res) => {
                // console.log("DIs ", res);
            })
            .catch((err) => {
                console.log("error => ", err);
            });

        // console.log(result);
    });

    socket.on("disconnect", () => {
        User.update({
            socketId: null,
        }, {
            where: {
                socketId: socket.id,
            },
        });
        // console.log("Disconnected");
    });
});

db.sequelize.sync().then(() => {
    server.listen(config.port);
});