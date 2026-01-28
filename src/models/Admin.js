import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  discordId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  username: String,
  avatar: String,
  role: { 
    type: String, 
    enum: ['SuperAdmin', 'Moderator'], 
    default: 'Moderator' 
  },
  addedBy: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
