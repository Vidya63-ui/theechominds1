import jwt from "jsonwebtoken";
import { generateOtp } from "../utils/generateOtp.js";
import { sendEmployeeOtpEmail } from "../services/emailService.js";
import { success, error } from "../utils/response.js";

const EMPLOYEE_DOMAIN = "theechominds.com";
/** Only local-part@theechominds.com (case-insensitive). */
const EMPLOYEE_EMAIL_RE = /^[a-z0-9](?:[a-z0-9._%+-]*[a-z0-9])?@theechominds\.com$/i;

const OTP_EXPIRY_MS = 10 * 60 * 1000;
/** Employee browser session length */
const JWT_EXPIRY = "1d";

/** @type {Map<string, { otp: string, expires: number }>} */
const otpStore = new Map();

function normalizeEmployeeEmail(raw) {
  const e = String(raw || "").trim().toLowerCase();
  if (!EMPLOYEE_EMAIL_RE.test(e)) return null;
  return e;
}

export async function requestEmployeeOtp(req, res) {
  try {
    const email = normalizeEmployeeEmail(req.body?.email);
    if (!email) {
      return error(
        res,
        `Only company email addresses ending in @${EMPLOYEE_DOMAIN} are allowed.`,
        400
      );
    }

    const otp = generateOtp();
    const expires = Date.now() + OTP_EXPIRY_MS;
    otpStore.set(email, { otp, expires });

    try {
      await sendEmployeeOtpEmail(email, otp);
    } catch (emailErr) {
      console.error("Employee OTP email error:", emailErr);
      otpStore.delete(email);
      return error(res, "Failed to send verification email. Try again later.", 500);
    }

    return success(res, {
      message: "Verification code sent. Check your EchoMinds inbox.",
    });
  } catch (err) {
    console.error("requestEmployeeOtp:", err);
    return error(res, "Could not send code", 500);
  }
}

export async function getEmployeeMe(req, res) {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      return error(res, "Unauthorized", 401);
    }
    const token = auth.slice(7);
    if (!process.env.JWT_SECRET) {
      return error(res, "Server misconfiguration", 500);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "employee" || !decoded.email) {
      return error(res, "Invalid session", 401);
    }
    return success(res, { employee: { email: decoded.email } });
  } catch {
    return error(res, "Invalid or expired session", 401);
  }
}

export async function verifyEmployeeOtp(req, res) {
  try {
    const email = normalizeEmployeeEmail(req.body?.email);
    const otp = String(req.body?.otp || "").trim();
    if (!email || !otp) {
      return error(res, "Email and verification code are required", 400);
    }

    const row = otpStore.get(email);
    if (!row || row.otp !== otp) {
      return error(res, "Invalid verification code", 400);
    }
    if (Date.now() > row.expires) {
      otpStore.delete(email);
      return error(res, "Code expired. Request a new one.", 400);
    }

    otpStore.delete(email);

    if (!process.env.JWT_SECRET) {
      return error(res, "Server misconfiguration", 500);
    }

    const token = jwt.sign(
      { email, role: "employee" },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    return success(res, {
      message: "Signed in",
      token,
      employee: { email },
    });
  } catch (err) {
    console.error("verifyEmployeeOtp:", err);
    return error(res, "Verification failed", 500);
  }
}
