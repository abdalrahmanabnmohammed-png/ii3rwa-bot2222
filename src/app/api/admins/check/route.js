import connectMongo from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID مطلوب" }, { status: 400 });

  await connectMongo();
  const isAdmin = await Admin.findOne({ discordId: id });

  if (isAdmin) {
    return NextResponse.json({ authorized: true });
  } else {
    return NextResponse.json({ authorized: false }, { status: 403 });
  }
}
