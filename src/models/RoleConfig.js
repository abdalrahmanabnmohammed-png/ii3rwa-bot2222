import mongoose from "mongoose";

const RoleConfigSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  roleId: { type: String, required: true, unique: true },
  roleName: String,
  canAccessDashboard: { type: Boolean, default: false }, // الدخول للوحة التحكم
  canManageTickets: { type: Boolean, default: false },   // استلام التذاكر
  canManageSecurity: { type: Boolean, default: false },  // نظام الحماية
  isAdminInServer: { type: Boolean, default: false },    // صلاحيات إدارية عامة
});

export default mongoose.models.RoleConfig || mongoose.model("RoleConfig", RoleConfigSchema);
