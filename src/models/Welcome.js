import mongoose from "mongoose";

const WelcomeSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  channelId: { type: String, default: "" },
  message: { type: String, default: "أهلاً بك {user} في سيرفرنا! ✨" },
  status: { type: Boolean, default: false },
  // إعدادات الصورة المضافة
  useImage: { type: Boolean, default: false },
  backgroundUrl: { type: String, default: "https://i.ibb.co/default-bg.png" },
  textColor: { type: String, default: "#ffffff" },
  welcomeTitle: { type: String, default: "WELCOME" },
  updatedBy: String,
  lastUpdate: { type: Date, default: Date.now }
});

export default mongoose.models.Welcome || mongoose.model("Welcome", WelcomeSchema);
