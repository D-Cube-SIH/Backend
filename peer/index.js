const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
let messages = [];

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serve your HTML/CSS from public folder

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.get("/messages", (req, res) => {
  res.json(messages);
});

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("sendMessage", (msg) => {
    messages.push(msg);
    io.emit("receiveMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

server.listen(3500, () => {
  console.log("🚀 Server running on http://localhost:3500");
});
