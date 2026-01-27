import mongoose from 'mongoose';

// تعريف شكل البيانات الخاص ببوت الحماية
const SecuritySchema = new mongoose.Schema({
    guildId: { 
        type: String, 
        required: true, 
        unique: true 
    }, // معرف سيرفر الديسكورد
    settings: {
        antiLink: { type: Boolean, default: false }, // منع الروابط
        antiSpam: { type: Boolean, default: false }, // منع السبام
        logChannel: { type: String, default: "" },   // قناة السجلات
        welcomeMessage: { type: String, default: "مرحباً بك في السيرفر!" }
    },
    updatedAt: { type: Date, default: Date.now }
});

// تصدير النموذج ليكون جاهزاً للاستخدام في الموقع
export default mongoose.models.Security || mongoose.model('Security', SecuritySchema);
