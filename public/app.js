const socket = io();

const statusEl = document.getElementById("status");
const roomEl = document.getElementById("roomA");
const statusBEl = document.getElementById("status-b");

const addStatus = (data) => {
  if (statusEl) {
    statusEl.textContent = data.message;
  } else {
    statusEl.textContent = "Desconectado";
  }
  if (roomEl) roomEl.textContent = data.room;
  if (statusBEl) statusBEl.textContent = data.message;
};

socket.on("welcome", (data) => {
  addStatus(data);
});