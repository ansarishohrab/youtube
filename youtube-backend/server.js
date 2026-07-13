require("dotenv").config();
const express = require("express");
const cors = require("cors");
const runMigrations = require("./migrations/migrate");
const videoRoutes = require("./routes/video.routes");
const commentRoutes = require("./routes/comment.routes");
const authRoutes = require("./routes/auth.routes");
const channelRoutes = require("./routes/channel.routes");


const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://youtube-9tzpi36vp-sohrabalam.vercel.app",
    ],
  }),
);
app.use("/auth", authRoutes);
app.use("/videos", videoRoutes);
app.use("/videos", commentRoutes);
app.use("/channels", channelRoutes);


async function startServer() {
  try {
    await runMigrations();

    app.listen(3000, () => {
      console.log("🚀 Server running on port 3000");
    });
  } catch (error) {
    console.error("Failed to start server");
    process.exit(1);
  }
}

startServer();
