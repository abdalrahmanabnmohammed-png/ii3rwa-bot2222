import connectMongo from "@/lib/mongodb";
import LevelConfig from "@/models/LevelConfig";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const GUILD_ID = "1349181448099336303";

export async function GET() {
  await connectMongo();
  let config = await LevelConfig.findOne({ guildId: GUILD_ID });
  if (!config) config = await LevelConfig.create({ guildId: GUILD_ID });
  return NextResponse.json(config);
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const body = await req.json();
    await connectMongo();

    const config = await LevelConfig.findOneAndUpdate(
      { guildId: GUILD_ID },
      { ...body },
      { upsert: true, new: true }
    );

    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: "خطأ في السيرفر" }, { status: 500 });
  }
}
