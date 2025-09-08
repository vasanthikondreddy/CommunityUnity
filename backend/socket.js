let io;

module.exports = {
  init: (server) => {
    io = require("socket.io")(server, {
      cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"],
        credentials: true,              
      },
      transports: ["websocket"],        
    });

    io.on("connection", (socket) => {
      console.log("🔌 New client connected:", socket.id);

      socket.onAny((event, ...args) => {
        console.log(`📡 Event received: ${event}`, args);
      });

      socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`🟢 User joined room: ${roomId}`);
      });

      socket.on("sendMessage", (data) => {
        io.to(data.room).emit("receiveMessage", data);
      });

      socket.on("disconnect", (reason) => {
        console.log("❌ Client disconnected:", socket.id, "Reason:", reason);
      });
    });

    return io;
  },

  getIO: () => {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
  },
};
