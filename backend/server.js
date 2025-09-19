const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { createServer } = require("http");
const { init } = require("./socket"); 

dotenv.config();

const app = express();
const server = createServer(app);
const io = init(server); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ["http://13.220.86.201:38819","http://13.220.86.201:5174","http://13.220.86.201"],
  credentials: true,
}));

app.use("/uploads", express.static("uploads"));

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const reportRoutes = require('./routes/reportRoutes');
const taskRoutes = require("./routes/tasks");
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/tasks", taskRoutes);

app.use('/api', reportRoutes);

app.get("/api", (req, res) => {
  res.send("✅ API is running and ready!");
});

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
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    server.listen(PORT,  '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err));
