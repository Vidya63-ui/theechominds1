import express from "express";
import { requestEmployeeOtp, verifyEmployeeOtp, getEmployeeMe } from "../controllers/employeeAuthController.js";

const router = express.Router();

router.post("/request-otp", requestEmployeeOtp);
router.post("/verify-otp", verifyEmployeeOtp);
router.get("/me", getEmployeeMe);

export default router;
