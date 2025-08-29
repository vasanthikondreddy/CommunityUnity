const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const server = createServer(app);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update if using production frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

app.set("io", io);


app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const announcementRoutes = require("./routes/announcementRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/announcements", announcementRoutes);


io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("postAnnouncement", (msg) => {
    io.emit("newAnnouncement", msg); 
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err));
