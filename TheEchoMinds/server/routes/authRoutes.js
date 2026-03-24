import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  signup,
  login,
  verifyOtp,
  resendOtp,
  me,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/register", signup);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.get("/me", requireAuth, me);
router.post("/logout", logout);

export default router;
