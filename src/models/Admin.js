import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true },
  addedBy: { type: String, required: true }, // ID الشخص الذي أضافه (أنت)
  role: { type: String, default: "admin" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
