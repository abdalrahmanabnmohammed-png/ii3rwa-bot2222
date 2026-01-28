import mongoose from "mongoose";

const WelcomeSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  channelId: { type: String, default: "" },
  message: { type: String, default: "أهلاً بك {user} في سيرفرنا المتواضع! ✨" },
  status: { type: Boolean, default: false },
  updatedBy: String,
  lastUpdate: { type: Date, default: Date.now }
});

export default mongoose.models.Welcome || mongoose.model("Welcome", WelcomeSchema);
