import mongoose from 'mongoose';

const SecuritySchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    antiLink: { type: Boolean, default: false },
    antiSpam: { type: Boolean, default: false },
    logChannel: String,
});

export default mongoose.models.Security || mongoose.model('Security', SecuritySchema);
