import connectMongo from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const OWNER_IDS = ["741981934447493160", "000000000000000"]; // آيدي الملاك

// دالة لجلب بيانات المستخدم من ديسكورد باستخدام الـ Token
async function getDiscordUser(userId) {
  try {
    const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) { return null; }
}

export async function GET() {
  try {
    await connectMongo();
    const adminsData = await Admin.find({});
    
    // جلب معلومات كل إداري من ديسكورد
    const adminsWithInfo = await Promise.all(adminsData.map(async (admin) => {
      const discordInfo = await getDiscordUser(admin.discordId);
      return {
        discordId: admin.discordId,
        username: discordInfo?.username || "غير معروف",
        avatar: discordInfo?.avatar 
          ? `https://cdn.discordapp.com/avatars/${admin.discordId}/${discordInfo.avatar}.png`
          : "https://cdn.discordapp.com/embed/avatars/0.png"
      };
    }));

    return NextResponse.json({ admins: adminsWithInfo });
  } catch (error) {
    return NextResponse.json({ error: "فشل الجلب" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !OWNER_IDS.includes(session.user.id)) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    const { newAdminId } = await req.json();
    await connectMongo();
    if (await Admin.findOne({ discordId: newAdminId })) return NextResponse.json({ error: "موجود مسبقاً" }, { status: 400 });
    await Admin.create({ discordId: newAdminId, addedBy: session.user.id });
    return NextResponse.json({ message: "تمت الإضافة" });
  } catch (error) { return NextResponse.json({ error: "خطأ" }, { status: 500 }); }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !OWNER_IDS.includes(session.user.id)) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await connectMongo();
    await Admin.deleteOne({ discordId: id });
    return NextResponse.json({ message: "تم الحذف" });
  } catch (error) { return NextResponse.json({ error: "فشل الحذف" }, { status: 500 }); }
}
