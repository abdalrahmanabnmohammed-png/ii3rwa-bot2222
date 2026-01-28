import connectMongo from "@/lib/mongodb";
import Admin from "@/models/Admin";
import RoleConfig from "@/models/RoleConfig";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const OWNER_IDS = ["741981934447493160"]; // ⚠️ ضع الآيدي الخاص بك هنا
const GUILD_ID = "1349181448099336303"; 

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !OWNER_IDS.includes(session.user.id)) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const { newAdminId, selectedRoleId, permissions } = await req.json();
    await connectMongo();

    // 1. حفظ أو تحديث إعدادات الرتبة في قاعدة البيانات
    await RoleConfig.findOneAndUpdate(
      { roleId: selectedRoleId },
      { 
        guildId: GUILD_ID,
        ...permissions 
      },
      { upsert: true }
    );

    // 2. إذا كانت الرتبة تمنح دخول اللوحة، نضيف الشخص كإداري
    if (permissions.canAccessDashboard) {
      await Admin.findOneAndUpdate(
        { discordId: newAdminId },
        { role: "Moderator", addedBy: session.user.id },
        { upsert: true }
      );
    }

    // 3. منح الرتبة في ديسكورد
    await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/members/${newAdminId}/roles/${selectedRoleId}`, {
      method: "PUT",
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` }
    });

    return NextResponse.json({ message: "تم تحديث الصلاحيات ومنح الرتبة" });
  } catch (error) {
    return NextResponse.json({ error: "خطأ في السيرفر" }, { status: 500 });
  }
}
