let io;

module.exports = {
  init: (server) => {
    io = require("socket.io")(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("🔌 New client connected:", socket.id);

      // Join room
      socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`🟢 User joined room: ${roomId}`);
      });

      // Send chat message
      socket.on("sendMessage", (data) => {
        // data = { room: 'event123', user: 'Vasanthi', text: 'Hello!' }
        io.to(data.room).emit("receiveMessage", data);
      });

      socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
      });
    });

    return io;
  },

  getIO: () => {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
  },
};
