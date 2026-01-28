import connectMongo from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  const OWNER_IDS = ["741981934447493160"]; // ضع الآيدي الخاص بك
  if (OWNER_IDS.includes(session.user.id)) return NextResponse.json({ ok: true });

  await connectMongo();
  const isAdmin = await Admin.findOne({ discordId: session.user.id });
  
  return NextResponse.json({ ok: !!isAdmin });
}
