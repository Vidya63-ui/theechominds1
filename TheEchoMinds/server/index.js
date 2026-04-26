import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import preorderRoutes from "./routes/preorderRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import investorEnquiryRoutes from "./routes/investorEnquiryRoutes.js";
import employeeAuthRoutes from "./routes/employeeAuthRoutes.js";
import { requireAuth } from "./middleware/auth.js";
import { createHelpCentreTicket } from "./controllers/helpCentreController.js";
import adminRoutes from "./routes/adminRoutes.js";
import { listPublicHomeGalleryItems } from "./homeGalleryList.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 5000;
let dbReady = false;

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Mobile app / curl / Postman can have no Origin header
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

const uploadsPath = path.resolve(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, db: dbReady });
});

/** Homepage masonry: media files from `public/gallery` (no DB). */
app.get("/api/home-gallery", (_req, res) => {
  try {
    const items = listPublicHomeGalleryItems();
    res.json({ items });
  } catch (err) {
    console.error("home-gallery:", err);
    res.status(500).json({ items: [], message: "Could not list gallery folder" });
  }
});

/** OTP lives in memory — must not sit behind the generic /api DB gate. */
app.use("/api/employee-auth", employeeAuthRoutes);

/**
 * Admin API must be registered before `app.use("/api", …)` so paths like
 * `/api/admin/orders` are not swallowed by the blanket `/api` middleware.
 */
app.use(
  "/api/admin",
  (req, res, next) => {
    if (!dbReady) {
      return res.status(503).json({
        message: "Database unavailable. Please try again in a few seconds.",
      });
    }
    next();
  },
  adminRoutes,
);

/**
 * Help Centre ticket POST is registered directly on `app` (before the blanket `/api`
 * middleware) so the path always matches — nested `Router` mounts were still 404ing in dev.
 */
app.post(
  "/api/help-centre/tickets",
  (req, res, next) => {
    if (!dbReady) {
      return res.status(503).json({
        message: "Database unavailable. Please try again in a few seconds.",
      });
    }
    next();
  },
  requireAuth,
  createHelpCentreTicket,
);

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
app.use("/api/investor-enquiries", investorEnquiryRoutes);

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
