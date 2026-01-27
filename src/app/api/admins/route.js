import connectMongo from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

const OWNER_ID = "YOUR_DISCORD_ID_HERE"; // ضع الأيدي الخاص بك هنا

export async function POST(req) {
  const session = await getServerSession(authOptions);

  // 1. التحقق من تسجيل الدخول
  if (!session) return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });

  // 2. التحقق من أن المرسل هو المالك (أنت فقط)
  if (session.user.id !== OWNER_ID) {
    return NextResponse.json({ error: "فقط المالك يمكنه إضافة إداريين" }, { status: 403 });
  }

  try {
    const { newAdminId } = await req.json();
    await connectMongo();

    const existingAdmin = await Admin.findOne({ discordId: newAdminId });
    if (existingAdmin) return NextResponse.json({ error: "هذا الإداري موجود بالفعل" }, { status: 400 });

    const newAdmin = await Admin.create({
      discordId: newAdminId,
      addedBy: OWNER_ID
    });

    return NextResponse.json({ message: "تمت إضافة الإداري بنجاح", admin: newAdmin });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ في السيرفر" }, { status: 500 });
  }
}
