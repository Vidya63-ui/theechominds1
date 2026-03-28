import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

function getToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1];
}

/** Require valid JWT - user must be logged in */
export async function requireAuth(req, res, next) {
  try {
    const token = getToken(req);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password -otp -otpExpiry");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

/** Require logged in AND email verified - blocks preorder/order if not verified */
export async function requireVerified(req, res, next) {
  try {
    const token = getToken(req);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password -otp -otpExpiry");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before placing an order or preorder.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
