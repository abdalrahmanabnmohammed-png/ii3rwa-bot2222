import connectMongo from "@/lib/mongodb";
import Welcome from "@/models/Welcome";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const GUILD_ID = "1349181448099336303"; // آيدي سيرفرك

// جلب الإعدادات الحالية
export async function GET() {
  try {
    await connectMongo();
    let config = await Welcome.findOne({ guildId: GUILD_ID });
    if (!config) config = await Welcome.create({ guildId: GUILD_ID });
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: "فشل جلب البيانات" }, { status: 500 });
  }
}

// حفظ الإعدادات الجديدة
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const body = await req.json();
    await connectMongo();

    const updatedConfig = await Welcome.findOneAndUpdate(
      { guildId: GUILD_ID },
      { ...body, updatedBy: session.user.id, lastUpdate: Date.now() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: "تم الحفظ بنجاح", config: updatedConfig });
  } catch (error) {
    return NextResponse.json({ error: "خطأ أثناء الحفظ" }, { status: 500 });
  }
}
