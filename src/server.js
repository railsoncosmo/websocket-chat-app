import express from "express";
import http from "http";
import { Server } from "socket.io";
import crypto from "crypto"

const app = express();
app.use(express.static("public"));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let rooms = [];

io.on("connection", (socket) => {
  socket.emit("welcome", { message: "Conectado", room: socket.id });

  socket.on("message", (data) => {
    io.emit("message", {
      msg: data,
      timestamp: Date.now(),
      senderId: socket.id,
    });
  });

  socket.on("createRoom", (data) => {
    const exists = rooms.filter(room => room.name === data.name.trim());
    
    if (exists.length > 0) {
      socket.emit("roomAlreadyExists", { message: "Já existe uma sala com este nome" });
      return;
    }
    const newRoomId = crypto.randomUUID();
    const newRoom = {
      id: newRoomId,
      name: data.name,
    };
    rooms.push(newRoom);
    console.log("Salas Disponíveis:", JSON.stringify(rooms, null, 2));
    socket.emit("roomCreated", { newRoomId, roomName: data.name });
  });

  socket.on("deleteAllRooms", () => {
    if(rooms.length === 0) {
      socket.emit("noRoomsToDelete", { message: "Não há salas para excluir" });
      return;
    }
    rooms = [];
    console.log("Salas:", JSON.stringify(rooms, null, 2));
    socket.emit("roomsDeleted", { message: "Todas as salas foram excluídas" });
  });

  socket.on("disconnect", (data) => {
    io.emit("goodbye", { message: "Desconectado", room: socket.id });
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});