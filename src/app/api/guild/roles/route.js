import { NextResponse } from "next/server";

const GUILD_ID = "1349181448099336303"; // آيدي سيرفرك

export async function GET() {
  try {
    const response = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/roles`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      },
    });

    if (!response.ok) return NextResponse.json({ error: "فشل جلب الرتب" }, { status: 500 });

    const roles = await response.json();
    
    // تصفية الرتب لإظهار المهم منها فقط (تجنب رتب البوتات أو رتبة everyone@)
    const filteredRoles = roles
      .filter(role => role.name !== "@everyone" && !role.managed)
      .map(role => ({
        id: role.id,
        name: role.name,
        color: role.color
      }));

    return NextResponse.json({ roles: filteredRoles });
  } catch (error) {
    return NextResponse.json({ error: "خطأ في السيرفر" }, { status: 500 });
  }
}
