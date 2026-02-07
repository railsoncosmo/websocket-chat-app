const socket = io();

const statusEl = document.getElementById("status");
const roomEl = document.getElementById("roomA");
const statusBEl = document.getElementById("status-b");
const disconnectEl = document.querySelector("#disconnect");
const statusIndicator = document.querySelector(".status-indicator");
const statusBadge = document.getElementById("status");
const statusContainer = document.getElementById("status-container");

const messagesList = document.getElementById("messages-list");
const messageInput = document.getElementById("message-input");
const messageForm = document.querySelector(".dashboard__input");
const sendButton = document.getElementById("send-button");

socket.on("disconnect", () => {
  setDisconnected();
  addStatus({ message: "Desconectado" });
});

socket.on("connect", () => {
  setConnected();
  addStatus({ message: "Conectado" });
});

if (disconnectEl) {
  disconnectEl.addEventListener("click", () => {
    if (socket.connected) {
      socket.disconnect();
    } else {
      socket.connect();
    }
  });
}


const sendMessage = (e) => {
  e?.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;
  socket.emit("message", message);
  messageInput.value = "";
};

if (messageForm) messageForm.addEventListener("submit", sendMessage);
if (sendButton) sendButton.addEventListener("click", sendMessage);

const setConnected = () => {
  statusIndicator?.classList.remove("status-indicator--disconnected");
  statusIndicator?.classList.add("status-indicator--connected");
  statusBadge?.classList.remove("status-badge--disconnected");
  statusBadge?.classList.add("status-badge--connected");
  if (disconnectEl) {
    disconnectEl.classList.remove("dashboard__connect");
    disconnectEl.classList.add("dashboard__disconnect");
    disconnectEl.innerHTML = '<i class="fa-solid fa-power-off"></i> Desconectar';
    disconnectEl.setAttribute("aria-label", "Desconectar");
  }
  statusContainer?.classList.remove("dashboard__status--disconnected");
  statusContainer?.classList.add("dashboard__status--connected");
};

const setDisconnected = () => {
  statusIndicator?.classList.remove("status-indicator--connected");
  statusIndicator?.classList.add("status-indicator--disconnected");
  statusBadge?.classList.remove("status-badge--connected");
  statusBadge?.classList.add("status-badge--disconnected");
  if (disconnectEl) {
    disconnectEl.classList.remove("dashboard__disconnect");
    disconnectEl.classList.add("dashboard__connect");
    disconnectEl.innerHTML = '<i class="fa-solid fa-plug"></i> Conectar';
    disconnectEl.setAttribute("aria-label", "Conectar");
  }
  statusContainer?.classList.remove("dashboard__status--connected");
  statusContainer?.classList.add("dashboard__status--disconnected");
};

const addStatus = (data) => {
  if (statusEl) {
    statusEl.textContent = data.message ? data.message : "Desconectado";
  }
  if (roomEl) roomEl.textContent = data.room ? data.room : "Desconectado";
};

const escapeHtml = (text) => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

const addMessage = (text, isOutgoing) => {
  if (!messagesList) return;
  const article = document.createElement("article");
  article.className = `message message--${isOutgoing ? "outgoing" : "incoming"}`;
  article.innerHTML = `
    <i class="fa-solid fa-circle-user fa-2xl"></i>
    <div class="message__bubble message__bubble--${isOutgoing ? "outgoing" : "incoming"}">${escapeHtml(text)}</div>
  `;
  messagesList.appendChild(article);
  messagesList.scrollTop = messagesList.scrollHeight;
};

socket.on("message", (data) => {
  const isOutgoing = data.senderId === socket.id;
  addMessage(data.msg, isOutgoing);
});

socket.on("welcome", (data) => {
  addStatus(data);
});

const roomForm = document.querySelector(".register-card__form");
const roomNameInputEl = document.getElementById("room-name");
if (roomForm && roomNameInputEl) {
  roomForm.addEventListener("click", (e) => {
    e.preventDefault();
    const roomName = roomNameInputEl.value.trim();
    if (!roomName) return;
    socket.emit("createRoom", { name: roomName });
    roomNameInputEl.value = "";
  });
}

socket.on("roomAlreadyExists", (data) => {
  alert(data.message);
});

const roomListEl = document.getElementById("room-list");
const roomItemEl = document.getElementById("room-item");
socket.on("roomCreated", (data) => {
  let newItem = document.createElement("li");
  newItem.className = "register-card__list-item";
  newItem.innerHTML = `<i class="fa-solid fa-door-open register-card__list-icon" aria-hidden="true"></i> ${data.roomName}`;
  roomListEl.appendChild(newItem);
});

const deleteAllRooms = document.getElementById("delete-all-rooms");
deleteAllRooms.addEventListener("click", () => {
  socket.emit("deleteAllRooms");
});

socket.on("noRoomsToDelete", (data) => {
  alert(data.message);
});

socket.on("roomsDeleted", (data) => {
  alert(data.message);
  roomListEl.innerHTML = "";
});