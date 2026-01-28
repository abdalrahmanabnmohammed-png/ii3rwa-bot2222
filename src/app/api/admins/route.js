import connectMongo from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // المسار المصحح باستخدام @
import { NextResponse } from "next/server";

// قائمة الملاك (تأكد من وضع IDs الملاك هنا)
const OWNER_IDS = ["741981934447493160", "0000000000000000"]; 

export async function GET() {
  try {
    await connectMongo();
    const admins = await Admin.find({});
    return NextResponse.json({ admins });
  } catch (error) {
    return NextResponse.json({ error: "فشل جلب البيانات" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    // فحص الصلاحية: الملاك فقط هم من يضيفون للقاعدة
    if (!session || !OWNER_IDS.includes(session.user.id)) {
      return NextResponse.json({ error: "غير مصرح لك - يجب أن تكون مالكاً" }, { status: 403 });
    }

    const { newAdminId } = await req.json();
    if (!newAdminId) return NextResponse.json({ error: "الآيدي مطلوب" }, { status: 400 });

    await connectMongo();
    
    const exists = await Admin.findOne({ discordId: newAdminId });
    if (exists) return NextResponse.json({ error: "هذا الإداري موجود بالفعل" }, { status: 400 });

    const newAdmin = await Admin.create({
      discordId: newAdminId,
      addedBy: session.user.id
    });

    return NextResponse.json({ message: "تمت الإضافة", admin: newAdmin });
  } catch (error) {
    console.error("Admin POST Error:", error);
    return NextResponse.json({ error: "حدث خطأ في السيرفر" }, { status: 500 });
  }
}
