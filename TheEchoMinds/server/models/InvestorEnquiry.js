import mongoose from "mongoose";

const ENQUIRY_TYPES = ["investment", "partnership", "media_other"];

const investorEnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    organisation: { type: String, default: "", trim: true },
    enquiryType: { type: String, required: true, enum: ENQUIRY_TYPES },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

investorEnquirySchema.index({ createdAt: -1 });
investorEnquirySchema.index({ email: 1 });

export const InvestorEnquiry = mongoose.model("InvestorEnquiry", investorEnquirySchema);
export { ENQUIRY_TYPES };
