import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(express.static("public"));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.emit("welcome", { message: "Conectado", room: socket.id });

  socket.on("message", (data) => {
    io.emit("message", { msg: data, timestamp: Date.now() });
  });

  socket.on("disconnect", (data) => {
    io.emit("goodbye", { message: "Desconectado", room: socket.id });
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});