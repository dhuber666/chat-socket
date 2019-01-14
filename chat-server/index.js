var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
const cors = require("cors");

let _id = 0;
const chatRooms = [
  {
    name: "general",
    id: _id++,
    chats: [
      {
        sender: "dominik",
        message: "hi was geht?"
      }
    ],
    users: []
  }
];

app.use(cors());

app.get("/", function(req, res) {
  res.send("<h1>Hello world</h1>");
});

app.get("/rooms", (req, res) => {
  res.send(chatRooms);
});

io.of("/chat").on("connection", socket => {
  socket.on("message", (msg, room, name) => {
    const newChat = {
      sender: name,
      message: msg
    };
    console.log(newChat);
    chatRooms.map(chatRoom => {
      if (chatRoom.name === room) {
        chatRoom.chats.push(newChat);
      }
    });
    console.log("new message: ", msg);
    io.of("/chat")
      .in(room)
      .emit("message", newChat);
  });
  socket.on("joinRoom", (room, name) => {
    chatRooms.forEach(chatRoom => {
      console.log(chatRoom);
      if (chatRoom.users.includes(name.toLowerCase())) {
        console.log("hello");

        return socket.emit("err", "Username already been taken");
      } else {
        chatRoom.users.push(name.toLowerCase());
        socket.join(room);
        const joinedMessage = {
          sender: "System",
          message: `${name} has joined the room`
        };
        io.of("/chat")
          .to(room)
          .emit("newUser", joinedMessage);
        return socket.emit("success", "Joined room ", room);
      }
    });
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
