const express = require("express");
const app = express();
const http = require("node:http");
const mongoose = require("mongoose");
const index = require("./route/indexRoute.js");
const cors = require("cors");
const config = require("./config.js");
const { Server } = require("socket.io");
const dotenv = require("dotenv")
dotenv.config()


mongoose.connect(process.env.MONGO_URL);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//parse form data
app.use(express.urlencoded({ extended: false }));

//parse json data
app.use(express.json());

// cross origin
app.use(cors());


app.use("/", index);

server.listen(PORT, () => {
  console.log("Server is running on port 5000");
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userId) => {
    socket.join(userId);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });


  socket.on("new message", (newMessageRecieved,currentChat) => {
    var chat = currentChat.chat;

    if (!chat.member) return console.log("chat.users not defined");

    chat.member.forEach((user) => {
      if (user == newMessageRecieved.sentFrom) return;

      socket.in(user).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userId);
  });
});
