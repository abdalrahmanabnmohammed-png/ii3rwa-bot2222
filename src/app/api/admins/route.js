import connectMongo from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// الإعدادات الخاصة بك
const OWNER_IDS = ["741981934447493160"]; // ⚠️ ضع الآيدي الخاص بك هنا لضمان صلاحية الوصول
const GUILD_ID = "1349181448099336303"; 
const ADMIN_ROLE_ID = "1424535593324646431"; 

async function getDiscordUser(userId) {
  try {
    const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
    });
    return response.ok ? await response.json() : null;
  } catch { return null; }
}

export async function GET() {
  try {
    await connectMongo();
    const adminsInDb = await Admin.find({});
    const adminsWithData = await Promise.all(adminsInDb.map(async (admin) => {
      const discordData = await getDiscordUser(admin.discordId);
      return {
        ...admin._doc,
        username: discordData?.global_name || discordData?.username || "Unknown User",
        avatar: discordData?.avatar 
          ? `https://cdn.discordapp.com/avatars/${admin.discordId}/${discordData.avatar}.png`
          : "https://cdn.discordapp.com/embed/avatars/0.png",
      };
    }));
    return NextResponse.json({ admins: adminsWithData });
  } catch {
    return NextResponse.json({ error: "فشل جلب قائمة الإداريين" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !OWNER_IDS.includes(session.user.id)) {
      return NextResponse.json({ error: "غير مصرح لك بالقيام بهذا الإجراء" }, { status: 403 });
    }

    const { newAdminId, role } = await req.json();
    await connectMongo();

    const exists = await Admin.findOne({ discordId: newAdminId });
    if (exists) return NextResponse.json({ error: "هذا الإداري مضاف مسبقاً" }, { status: 400 });

    await Admin.create({ discordId: newAdminId, role, addedBy: session.user.id });

    // منح الرتبة تلقائياً في ديسكورد
    await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/members/${newAdminId}/roles/${ADMIN_ROLE_ID}`, {
      method: "PUT",
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` }
    });

    return NextResponse.json({ message: "تمت الإضافة بنجاح ومنح الرتبة" });
  } catch {
    return NextResponse.json({ error: "خطأ في السيرفر" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !OWNER_IDS.includes(session.user.id)) return NextResponse.json({ status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await connectMongo();
    await Admin.deleteOne({ discordId: id });

    // سحب الرتبة تلقائياً عند الحذف من اللوحة
    await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/members/${id}/roles/${ADMIN_ROLE_ID}`, {
      method: "DELETE",
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` }
    });

    return NextResponse.json({ message: "تم حذف الإداري وسحب الصلاحية" });
  } catch { return NextResponse.json({ status: 500 }); }
}
