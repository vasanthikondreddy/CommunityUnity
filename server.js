const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http"); 

const authRoutes = require("./routes/authRoutes"); 
const eventRoutes = require("./routes/eventRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const { init } = require("./socket"); 

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);

app.use("/api/events", eventRoutes);
app.use("/api/volunteers", volunteerRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");

    init(server);

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection failed:", err));
