import { Router } from "express";
import { createInvestorEnquiry } from "../controllers/investorEnquiryController.js";

const router = Router();

router.post("/", createInvestorEnquiry);

export default router;
