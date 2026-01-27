import mongoose from 'mongoose';

const EngagementSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    youtubeChannelId: String,
    welcomeMessage: String,
    levelingSystem: { type: Boolean, default: true },
});

export default mongoose.models.Engagement || mongoose.model('Engagement', EngagementSchema);
