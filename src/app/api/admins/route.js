import connectMongo from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// ⚠️ ضع هنا الآيدي الخاص بك بدقة
const OWNER_IDS = ["741981934447493160"]; 

// دالة جلب بيانات مستخدم من ديسكورد
async function getDiscordUser(userId) {
  try {
    const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) { return null; }
}

// 1. دالة GET (لجلب قائمة الإداريين وعرضها في الصفحة)
export async function GET() {
  try {
    await connectMongo();
    const adminsData = await Admin.find({});
    
    const adminsWithInfo = await Promise.all(adminsData.map(async (admin) => {
      const discordInfo = await getDiscordUser(admin.discordId);
      return {
        discordId: admin.discordId,
        username: discordInfo?.global_name || discordInfo?.username || "إداري غير معروف",
        avatar: discordInfo?.avatar 
          ? `https://cdn.discordapp.com/avatars/${admin.discordId}/${discordInfo.avatar}.png`
          : "https://cdn.discordapp.com/embed/avatars/0.png"
      };
    }));

    return NextResponse.json({ admins: adminsWithInfo });
  } catch (error) {
    return NextResponse.json({ error: "فشل جلب البيانات" }, { status: 500 });
  }
}

// 2. دالة POST (لإضافة إداري جديد)
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !OWNER_IDS.includes(session.user.id)) {
      return NextResponse.json({ error: "غير مصرح لك" }, { status: 403 });
    }

    const { newAdminId } = await req.json();
    if (!newAdminId || newAdminId.length < 17) {
      return NextResponse.json({ error: "ID غير صحيح" }, { status: 400 });
    }

    await connectMongo();
    const existing = await Admin.findOne({ discordId: newAdminId });
    if (existing) return NextResponse.json({ error: "موجود مسبقاً" }, { status: 400 });

    await Admin.create({ discordId: newAdminId, addedBy: session.user.id });
    return NextResponse.json({ message: "تمت الإضافة بنجاح" });
  } catch (error) {
    return NextResponse.json({ error: "خطأ في السيرفر" }, { status: 500 });
  }
}

// 3. دالة DELETE (لحذف إداري)
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !OWNER_IDS.includes(session.user.id)) {
      return NextResponse.json({ error: "غير مصرح لك" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    await connectMongo();
    await Admin.deleteOne({ discordId: id });
    return NextResponse.json({ message: "تم الحذف بنجاح" });
  } catch (error) {
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
}
