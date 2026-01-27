import connectMongo from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// قائمة الملاك المسموح لهم بإضافة إداريين
const OWNER_IDS = ["123456789012345678", "000000000000000000"]; 

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !OWNER_IDS.includes(session.user.id)) {
      return NextResponse.json({ error: "غير مصرح لك" }, { status: 403 });
    }

    const { newAdminId } = await req.json();
    if (!newAdminId) return NextResponse.json({ error: "الآيدي مطلوب" }, { status: 400 });

    await connectMongo();

    const existingAdmin = await Admin.findOne({ discordId: newAdminId });
    if (existingAdmin) return NextResponse.json({ error: "الإداري موجود مسبقاً" }, { status: 400 });

    const newAdmin = await Admin.create({
      discordId: newAdminId,
      addedBy: session.user.id
    });

    return NextResponse.json({ message: "تمت الإضافة بنجاح", admin: newAdmin });
  } catch (error) {
    console.error("Admin API Error:", error);
    return NextResponse.json({ error: "حدث خطأ في السيرفر" }, { status: 500 });
  }
}
