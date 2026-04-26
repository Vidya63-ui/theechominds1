import { HelpCentreTicket, HELP_CATEGORIES } from "../models/HelpCentreTicket.js";
import { generateHelpTicketId } from "../utils/generateId.js";
import { success, error } from "../utils/response.js";

const CATEGORY_LABEL = {
  complaint: "Complaint",
  requirement: "Requirement / feature request",
  service_repair: "Service or repair",
  other: "Other query",
};

function isValidEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).trim());
}

/** Logged-in customers only — name / email / phone come from the account. */
export async function createHelpCentreTicket(req, res) {
  try {
    const body = req.body || {};
    const category = String(body.category || "").trim();
    const message = String(body.message || "").trim();

    const name = String(req.user.name || "").trim();
    const email = String(req.user.email || "").trim().toLowerCase();
    const phone = String(req.user.phone || "").trim();

    if (!HELP_CATEGORIES.includes(category)) {
      return error(res, "Please choose a valid request type.", 400);
    }
    if (name.length < 2) {
      return error(
        res,
        "Your profile name is missing or too short. Update it in My profile / Dashboard, then try again.",
        400,
      );
    }
    if (!isValidEmail(email)) {
      return error(res, "Your account email is invalid. Please contact support.", 400);
    }
    if (message.length < 10) {
      return error(res, "Please describe your request in at least 10 characters.", 400);
    }

    const ticketId = generateHelpTicketId();
    const doc = await HelpCentreTicket.create({
      ticketId,
      category,
      name,
      email,
      phone,
      message,
      userId: req.user._id,
    });

    return success(
      res,
      {
        ticket: {
          ticketId: doc.ticketId,
          category: doc.category,
          categoryLabel: CATEGORY_LABEL[doc.category] || doc.category,
          createdAt: doc.createdAt,
        },
        message: "Thanks — we have received your request and will get back to you by email.",
      },
      201,
    );
  } catch (err) {
    console.error("createHelpCentreTicket:", err);
    return error(res, "Could not save your request. Please try again.", 500);
  }
}

/** Employee admin */
export async function listHelpCentreTicketsAdmin(_req, res) {
  try {
    const tickets = await HelpCentreTicket.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email phone")
      .lean();
    return success(res, { tickets });
  } catch (err) {
    console.error("listHelpCentreTicketsAdmin:", err);
    return error(res, "Failed to load help centre tickets", 500);
  }
}
