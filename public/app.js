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

disconnectEl.addEventListener("click", () => {
  if (socket.connected) {
    socket.disconnect();
  } else {
    socket.connect();
  }
});


const sendMessage = (e) => {
  e?.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;
  socket.emit("message", message);
  messageInput.value = "";
};

messageForm.addEventListener("submit", sendMessage);
sendButton.addEventListener("click", sendMessage);

const setConnected = () => {
  statusIndicator?.classList.remove("status-indicator--disconnected");
  statusIndicator?.classList.add("status-indicator--connected");
  statusBadge?.classList.remove("status-badge--disconnected");
  statusBadge?.classList.add("status-badge--connected");
  disconnectEl.classList.remove("dashboard__connect");
  disconnectEl.classList.add("dashboard__disconnect");
  disconnectEl.innerHTML = '<i class="fa-solid fa-power-off"></i> Desconectar';
  disconnectEl.setAttribute("aria-label", "Desconectar");
  statusContainer?.classList.remove("dashboard__status--disconnected");
  statusContainer?.classList.add("dashboard__status--connected");
};

const setDisconnected = () => {
  statusIndicator?.classList.remove("status-indicator--connected");
  statusIndicator?.classList.add("status-indicator--disconnected");
  statusBadge?.classList.remove("status-badge--connected");
  statusBadge?.classList.add("status-badge--disconnected");
  disconnectEl.classList.remove("dashboard__disconnect");
  disconnectEl.classList.add("dashboard__connect");
  disconnectEl.innerHTML = '<i class="fa-solid fa-plug"></i> Conectar';
  disconnectEl.setAttribute("aria-label", "Conectar");
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

socket.on("disconnect", () => {
  setDisconnected();
  addStatus({ message: "Desconectado" });
});

socket.on("connect", () => {
  setConnected();
  addStatus({ message: "Conectado" });
});