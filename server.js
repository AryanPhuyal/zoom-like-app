const express = require("express");
const app = express();

const server = require("http").Server(app);

const io = require("socket.io")(server);

const { v4: uuidv4 } = require("uuid");
app.set("view engine", "ejs");
app.use(express.static("public"));

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use("/peers", peerServer);

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

server.listen(3000, (err) => {
  if (!err) {
    console.log("server is listening at 3000");
  } else {
    console.log(err);
  }
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    console.log("joined the room");
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
  });
});
