import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import preorderRoutes from "./routes/preorderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();
const port = process.env.PORT || 5000;
let dbReady = false;
const allowedOrigins = (process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((v) => v.trim())
  : ["http://localhost:5173", "http://127.0.0.1:5173"]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin not allowed by CORS"));
    },
  }),
);
app.use(express.json());
app.use("/uploads", express.static(path.resolve("server/uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, db: dbReady });
});

app.use("/api", (req, res, next) => {
  if (req.path === "/health") {
    return next();
  }
  if (!dbReady) {
    return res.status(503).json({ message: "Database unavailable. Please try again in a few seconds." });
  }
  return next();
});

app.use("/api/auth", authRoutes);
app.use("/api/preorders", preorderRoutes);
app.use("/api/payments", paymentRoutes);

async function connectWithRetry() {
  try {
    await connectDB();
    dbReady = true;
    console.log("MongoDB connected.");
  } catch (error) {
    dbReady = false;
    console.error("MongoDB connection failed:", error.message);
    console.log("Retrying MongoDB connection in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
}

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
  connectWithRetry();
});
