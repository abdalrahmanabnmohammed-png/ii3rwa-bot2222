import connectMongo from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// ⚠️ يجب أن تكون نفس القائمة الموجودة في الـ Frontend
const OWNER_IDS = ["YOUR_DISCORD_ID_1", "YOUR_DISCORD_ID_2"];

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || !OWNER_IDS.includes(session.user.id)) {
    return NextResponse.json({ error: "غير مصرح لك: فقط الملاك يمكنهم إضافة إداريين" }, { status: 403 });
  }

  try {
    const { newAdminId } = await req.json();
    await connectMongo();

    const existingAdmin = await Admin.findOne({ discordId: newAdminId });
    if (existingAdmin) return NextResponse.json({ error: "الإداري موجود مسبقاً" }, { status: 400 });

    const newAdmin = await Admin.create({
      discordId: newAdminId,
      addedBy: session.user.id
    });

    return NextResponse.json({ message: "تمت الإضافة", admin: newAdmin });
  } catch (error) {
    return NextResponse.json({ error: "فشل في حفظ البيانات" }, { status: 500 });
  }
}
