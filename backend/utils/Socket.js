const { Server } = require("socket.io");

let io;

function init(server) {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        process.env.FRONTEND_URL || "https://yourdomain.com"
      ],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });

    socket.on("eventCreated", (data) => {
      console.log("📢 Broadcasting new event:", data);
      socket.broadcast.emit("newEvent", data);
    });

    socket.on("announcementPosted", (data) => {
      socket.broadcast.emit("newAnnouncement", data);
    });

    socket.on("volunteerCheckedIn", (data) => {
      socket.broadcast.emit("volunteerUpdate", data);
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
}

module.exports = { init, getIO };
