import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import preorderRoutes from "./routes/preorderRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 5000;
let dbReady = false;

const allowedOrigins = (process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((v) => v.trim())
  : ["http://localhost:5173", "http://127.0.0.1:5173"]).filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());
app.use(express.json());
app.use(cookieParser());

const uploadsPath = path.resolve(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, db: dbReady });
});

app.use("/api", (req, res, next) => {
  if (req.path === "/health") return next();
  if (!dbReady) {
    return res.status(503).json({
      message: "Database unavailable. Please try again in a few seconds.",
    });
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/preorders", preorderRoutes);
app.use("/api/orders", orderRoutes);

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
