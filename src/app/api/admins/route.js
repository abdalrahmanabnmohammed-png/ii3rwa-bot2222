import connectMongo from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const OWNER_IDS = ["123456789012345678"]; // ضع الآيدي الخاص بك هنا

async function getDiscordUser(userId) {
  try {
    const token = process.env.DISCORD_TOKEN;
    if (!token) {
      console.error("DISCORD_TOKEN is missing in Environment Variables");
      return null;
    }

    const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: { 
        Authorization: `Bot ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 } // لضمان عدم تخزين بيانات قديمة
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

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

// أبقِ دوال POST و DELETE كما هي في الكود السابق
