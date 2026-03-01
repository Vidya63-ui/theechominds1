import express from "express";
import { requireVerified } from "../middleware/auth.js";
import { createPreorder, getMyPreorders } from "../controllers/preorderController.js";

const router = express.Router();

router.post("/", requireVerified, createPreorder);
router.get("/me", requireVerified, getMyPreorders);

export default router;
