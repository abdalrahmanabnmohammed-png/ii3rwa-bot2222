import connectMongo from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const GUILD_ID = "1349181448099336303";

export async function GET() {
  await connectMongo();
  let config = await Ticket.findOne({ guildId: GUILD_ID });
  if (!config) config = await Ticket.create({ guildId: GUILD_ID, reasons: ["دعم فني", "شكوى", "استفسار"] });
  return NextResponse.json(config);
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

    const body = await req.json();
    await connectMongo();

    const config = await Ticket.findOneAndUpdate(
      { guildId: GUILD_ID },
      { ...body },
      { upsert: true, new: true }
    );

    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: "خطأ في الحفظ" }, { status: 500 });
  }
}
