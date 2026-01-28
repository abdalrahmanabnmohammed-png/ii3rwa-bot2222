import mongoose from "mongoose";

const LevelConfigSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  isEnabled: { type: Boolean, default: false },
  xpPerMessage: { type: Number, default: 15 },
  // نظام الرتب التلقائية بناءً على المستوى
  levelRoles: [{
    level: { type: Number, required: true }, // المستوى المطلوب
    roleId: { type: String, required: true } // آيدي الرتبة التي سيتم منحها
  }],
  status: { type: Boolean, default: false }
});

export default mongoose.models.LevelConfig || mongoose.model("LevelConfig", LevelConfigSchema);
