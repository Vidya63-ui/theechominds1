import mongoose from "mongoose";

export const HELP_CATEGORIES = ["complaint", "requirement", "service_repair", "other"];

const helpCentreTicketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, enum: HELP_CATEGORIES },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    message: { type: String, required: true, trim: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

helpCentreTicketSchema.index({ createdAt: -1 });
helpCentreTicketSchema.index({ email: 1 });

export const HelpCentreTicket = mongoose.model("HelpCentreTicket", helpCentreTicketSchema);
