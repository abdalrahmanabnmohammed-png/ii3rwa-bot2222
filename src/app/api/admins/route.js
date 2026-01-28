import connectMongo from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// الإعدادات الخاصة بك
const OWNER_IDS = ["741981934447493160"]; // ⚠️ ضع الآيدي الخاص بك هنا
const GUILD_ID = "1349181448099336303"; 
const ADMIN_ROLE_ID = "1424535593324646431"; 

// دالة جلب بيانات العضو من ديسكورد (الاسم والصورة)
async function getDiscordUser(userId) {
  try {
    const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

// 1. جلب قائمة الإداريين (GET)
export async function GET() {
  try {
    await connectMongo();
    const adminsInDb = await Admin.find({});

    const adminsWithDiscordData = await Promise.all(
      adminsInDb.map(async (admin) => {
        const discordData = await getDiscordUser(admin.discordId);
        return {
          discordId: admin.discordId,
          username: discordData?.global_name || discordData?.username || "مستخدم غير معروف",
          avatar: discordData?.avatar 
            ? `https://cdn.discordapp.com/avatars/${admin.discordId}/${discordData.avatar}.png`
            : "https://cdn.discordapp.com/embed/avatars/0.png",
        };
      })
    );

    return NextResponse.json({ admins: adminsWithDiscordData });
  } catch (error) {
    return NextResponse.json({ error: "فشل جلب البيانات" }, { status: 500 });
  }
}

// 2. إضافة إداري ومنحه الرتبة (POST)
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    // التحقق من صلاحية المالك
    if (!session || !OWNER_IDS.includes(session.user.id)) {
      return NextResponse.json({ error: "غير مصرح لك" }, { status: 403 });
    }

    const { newAdminId } = await req.json();
    if (!newAdminId) return NextResponse.json({ error: "ID مطلوب" }, { status: 400 });

    await connectMongo();
    
    const exists = await Admin.findOne({ discordId: newAdminId });
    if (exists) return NextResponse.json({ error: "الإداري موجود مسبقاً" }, { status: 400 });

    // إضافة للقاعدة
    await Admin.create({ discordId: newAdminId, addedBy: session.user.id });

    // إضافة الرتبة في ديسكورد
    await fetch(
      `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${newAdminId}/roles/${ADMIN_ROLE_ID}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ message: "تمت الإضافة ومنح الرتبة" });
  } catch (error) {
    return NextResponse.json({ error: "خطأ في السيرفر" }, { status: 500 });
  }
}

// 3. حذف إداري وسحب الرتبة (DELETE)
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

    // سحب الرتبة من ديسكورد
    await fetch(
      `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${id}/roles/${ADMIN_ROLE_ID}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        },
      }
    );

    return NextResponse.json({ message: "تم الحذف وسحب الرتبة" });
  } catch (error) {
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
}
