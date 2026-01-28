import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  // الإعدادات العامة
  setupChannelId: String,   // الروم المخصص لرسالة الامبد
  logChannelId: String,     // روم حفظ التذاكر (Transcript)
  supportRoleId: String,    // الرتبة المخصصة للاستلام
  categoryId: String,       // الفئة التي تفتح فيها التذاكر
  
  // الخيارات
  reasons: [{ type: String }], // قائمة خيارات أسباب الفتح
  lastTicketNumber: { type: Number, default: 0 }, // للترقيم المتسلسل
  
  // الحالة
  status: { type: Boolean, default: false }
});

export default mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);
