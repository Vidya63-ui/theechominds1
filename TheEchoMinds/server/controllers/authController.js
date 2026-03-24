import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendOtpEmail } from "../services/emailService.js";
import { success, error } from "../utils/response.js";

const COOKIE_NAME = "token";
const OTP_EXPIRY_MINUTES = 10;
const JWT_EXPIRY = "7d";
const isProd = process.env.NODE_ENV === "production";

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

function setTokenCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export async function signup(req, res) {
  try {
    const { name, email, phone, password } = req.body;
    if (!email || !password) {
      return error(res, "Email and password are required", 400);
    }
    const phoneValue = (phone || "").trim() || null;
    const emailLower = email.toLowerCase().trim();

    const existing = await User.findOne({
      $or: [
        { email: emailLower },
        ...(phoneValue ? [{ phone: phoneValue }] : []),
      ],
    });
    if (existing) {
      return error(res, "Email or phone already registered", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Send OTP email FIRST - only save user to DB if email succeeds
    try {
      await sendOtpEmail(emailLower, otp);
    } catch (emailErr) {
      console.error("Resend OTP error:", emailErr);
      return error(
        res,
        "Failed to send verification email. Check your email address or try again later.",
        500
      );
    }

    const userName = (name || email.split("@")[0] || "User").trim();
    const userPhone = phoneValue || "pending";
    const user = await User.create({
      name: userName,
      email: emailLower,
      phone: userPhone,
      password: passwordHash,
      isVerified: false,
      otp,
      otpExpiry,
    });

    return success(res, {
      message: "Verification code sent. Check your email and enter it below.",
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified,
      },
    }, 201);
  } catch (err) {
    console.error("Signup error:", err);
    return error(res, "Failed to create account", 500);
  }
}

export async function login(req, res) {
  try {
    const { email, phone, password } = req.body;
    const identifier = email || phone;
    if (!identifier || !password) {
      return error(res, "Email or phone and password are required", 400);
    }

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase().trim() },
        { phone: identifier.trim() },
      ],
    });
    if (!user) {
      return error(res, "Invalid credentials", 401);
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return error(res, "Invalid credentials", 401);
    }

    if (!user.isVerified) {
      const otp = generateOtp();
      const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
      try {
        await sendOtpEmail(user.email, otp);
      } catch (emailErr) {
        console.error("Resend OTP error:", emailErr);
        return error(
          res,
          "Failed to send verification email. Please try again later.",
          500
        );
      }
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();

      return success(res, {
        needsVerification: true,
        email: user.email,
        message: "Verification code sent. Check your email and enter it below.",
      }, 200);
    }

    const token = signToken(user._id.toString());
    setTokenCookie(res, token);

    return success(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return error(res, "Failed to login", 500);
  }
}

export async function resendOtp(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return error(res, "Email is required", 400);
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return error(res, "User not found", 404);
    }

    if (user.isVerified) {
      return error(res, "Email already verified. Please log in.", 400);
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    try {
      await sendOtpEmail(user.email, otp);
    } catch (emailErr) {
      console.error("Resend OTP error:", emailErr);
      return error(
        res,
        "Failed to send verification email. Please try again later.",
        500
      );
    }

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    return success(res, {
      message: "Verification code sent. Check your email.",
    });
  } catch (err) {
    console.error("Resend OTP error:", err);
    return error(res, "Failed to resend code", 500);
  }
}

export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return error(res, "Email and OTP are required", 400);
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return error(res, "User not found", 404);
    }

    if (!user.otp || !user.otpExpiry) {
      return error(res, "No OTP pending. Request a new one.", 400);
    }

    if (user.otp !== otp.trim()) {
      return error(res, "Invalid OTP", 400);
    }

    if (new Date() > user.otpExpiry) {
      return error(res, "OTP has expired. Request a new one.", 400);
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = signToken(user._id.toString());
    setTokenCookie(res, token);

    return success(res, {
      message: "Email verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return error(res, "Failed to verify OTP", 500);
  }
}

export async function me(req, res) {
  const user = req.user;
  return success(res, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isVerified: user.isVerified,
    },
  });
}

export async function logout(req, res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  return success(res, { message: "Logged out" });
}
