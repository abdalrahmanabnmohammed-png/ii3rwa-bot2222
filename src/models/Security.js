import mongoose from "mongoose";

const SecuritySchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  // 1 & 7: السبام والتكرار
  spamDetection: { type: Boolean, default: false },
  maxMessages: { type: Number, default: 5 }, // عدد الرسائل المسموحة في 5 ثواني
  
  // 2: الكلمات المسيئة
  badWords: { type: Boolean, default: false },
  blockedWords: { type: [String], default: [] },

  // 3 & 5: الروابط والبوتات لرتب معينة
  linkProtection: { type: Boolean, default: false },
  allowedLinkRoles: { type: [String], default: [] }, // الرتب المسموح لها بالروابط
  allowedBotRoles: { type: [String], default: [] },  // الرتب المسموح لها بإضافة بوتات

  // 4: الأعضاء الوهميين
  fakeAccountProtection: { type: Boolean, default: false },
  minAccountAge: { type: Number, default: 7 }, // الحد الأدنى لعمر الحساب بالأيام

  // 6: الويب هوك
  webhookProtection: { type: Boolean, default: false },

  // 8: التحقق البشري
  captchaVerification: { type: Boolean, default: false },
  verificationChannel: String,

  // 9: اللوق
  logChannelId: String,
  dashboardLogs: [{
    action: String,
    adminId: String,
    timestamp: { type: Date, default: Date.now }
  }]
});

export default mongoose.models.Security || mongoose.model("Security", SecuritySchema);
