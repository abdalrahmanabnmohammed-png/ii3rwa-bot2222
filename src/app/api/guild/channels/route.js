import { NextResponse } from "next/server";

const GUILD_ID = "1349181448099336303"; // آيدي سيرفرك

export async function GET() {
  try {
    const response = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/channels`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`, // يتطلب توكن البوت في Secrets
      },
    });

    if (!response.ok) return NextResponse.json({ error: "فشل جلب القنوات" }, { status: 500 });

    const channels = await response.json();
    
    // تصفية القنوات لإظهار القنوات النصية فقط (Type 0 هو النصية)
    const textChannels = channels
      .filter(channel => channel.type === 0)
      .map(channel => ({
        id: channel.id,
        name: channel.name
      }));

    return NextResponse.json({ channels: textChannels });
  } catch (error) {
    return NextResponse.json({ error: "خطأ في السيرفر" }, { status: 500 });
  }
}
