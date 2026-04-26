import { InvestorEnquiry, ENQUIRY_TYPES } from "../models/InvestorEnquiry.js";
import { success, error } from "../utils/response.js";
import { sendInvestorEnquiryInternal } from "../services/emailService.js";

const TYPE_LABEL = {
  investment: "Investment / funding",
  partnership: "Strategic partnership",
  media_other: "Media or other",
};

function isValidEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).trim());
}

/** Public: no auth — investors may not have accounts */
export async function createInvestorEnquiry(req, res) {
  try {
    const { name, email, organisation, enquiryType, message } = req.body || {};

    const n = String(name || "").trim();
    const em = String(email || "").trim();
    const org = String(organisation || "").trim();
    const typ = String(enquiryType || "").trim();
    const msg = String(message || "").trim();

    if (n.length < 2) return error(res, "Please enter your name.", 400);
    if (!isValidEmail(em)) return error(res, "Please enter a valid email address.", 400);
    if (!ENQUIRY_TYPES.includes(typ)) return error(res, "Please choose an enquiry type.", 400);
    if (msg.length < 20) return error(res, "Please add a bit more detail (at least 20 characters).", 400);

    const doc = await InvestorEnquiry.create({
      name: n,
      email: em,
      organisation: org,
      enquiryType: typ,
      message: msg,
    });

    try {
      await sendInvestorEnquiryInternal({
        name: n,
        email: em,
        organisation: org || "—",
        enquiryLabel: TYPE_LABEL[typ] || typ,
        message: msg,
        id: String(doc._id),
      });
    } catch (emailErr) {
      console.error("Investor enquiry email notify failed:", emailErr);
    }

    return success(
      res,
      {
        message: "Thank you — we have received your enquiry.",
        enquiryId: doc._id,
      },
      201,
    );
  } catch (err) {
    console.error("Create investor enquiry error:", err);
    return error(res, "Could not submit your enquiry. Please try again or email us directly.", 500);
  }
}
