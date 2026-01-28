import connectMongo from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// ⚠️ تأكد أن هذا هو نفس الـ ID الخاص بك
const OWNER_IDS = ["741981934447493160"]; 

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    // التحقق من الجلسة
    if (!session || !OWNER_IDS.includes(session.user.id)) {
      return NextResponse.json({ error: "غير مصرح لك بالقيام بهذه العملية" }, { status: 403 });
    }

    const { newAdminId } = await req.json();

    // التحقق من صحة المدخلات
    if (!newAdminId || newAdminId.length < 17) {
      return NextResponse.json({ error: "يرجى إدخال ID ديسكورد صحيح ومكون من 17-19 رقم" }, { status: 400 });
    }

    await connectMongo();

    // منع تكرار الإداري
    const existingAdmin = await Admin.findOne({ discordId: newAdminId });
    if (existingAdmin) {
      return NextResponse.json({ error: "هذا الإداري موجود بالفعل في النظام" }, { status: 400 });
    }

    // الحفظ الفعلي
    const createdAdmin = await Admin.create({
      discordId: newAdminId,
      addedBy: session.user.id
    });

    return NextResponse.json({ message: "تمت الإضافة بنجاح", admin: createdAdmin }, { status: 201 });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "فشل الاتصال بقاعدة البيانات. تأكد من إعدادات MONGODB_URI في Vercel" }, { status: 500 });
  }
}import connectMongo from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// ⚠️ تأكد أن هذا هو نفس الـ ID الخاص بك
const OWNER_IDS = ["123456789012345678"]; 

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    // التحقق من الجلسة
    if (!session || !OWNER_IDS.includes(session.user.id)) {
      return NextResponse.json({ error: "غير مصرح لك بالقيام بهذه العملية" }, { status: 403 });
    }

    const { newAdminId } = await req.json();

    // التحقق من صحة المدخلات
    if (!newAdminId || newAdminId.length < 17) {
      return NextResponse.json({ error: "يرجى إدخال ID ديسكورد صحيح ومكون من 17-19 رقم" }, { status: 400 });
    }

    await connectMongo();

    // منع تكرار الإداري
    const existingAdmin = await Admin.findOne({ discordId: newAdminId });
    if (existingAdmin) {
      return NextResponse.json({ error: "هذا الإداري موجود بالفعل في النظام" }, { status: 400 });
    }

    // الحفظ الفعلي
    const createdAdmin = await Admin.create({
      discordId: newAdminId,
      addedBy: session.user.id
    });

    return NextResponse.json({ message: "تمت الإضافة بنجاح", admin: createdAdmin }, { status: 201 });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "فشل الاتصال بقاعدة البيانات. تأكد من إعدادات MONGODB_URI في Vercel" }, { status: 500 });
  }
}import connectMongo from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// ⚠️ تأكد أن هذا هو نفس الـ ID الخاص بك
const OWNER_IDS = ["123456789012345678"]; 

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    // التحقق من الجلسة
    if (!session || !OWNER_IDS.includes(session.user.id)) {
      return NextResponse.json({ error: "غير مصرح لك بالقيام بهذه العملية" }, { status: 403 });
    }

    const { newAdminId } = await req.json();

    // التحقق من صحة المدخلات
    if (!newAdminId || newAdminId.length < 17) {
      return NextResponse.json({ error: "يرجى إدخال ID ديسكورد صحيح ومكون من 17-19 رقم" }, { status: 400 });
    }

    await connectMongo();

    // منع تكرار الإداري
    const existingAdmin = await Admin.findOne({ discordId: newAdminId });
    if (existingAdmin) {
      return NextResponse.json({ error: "هذا الإداري موجود بالفعل في النظام" }, { status: 400 });
    }

    // الحفظ الفعلي
    const createdAdmin = await Admin.create({
      discordId: newAdminId,
      addedBy: session.user.id
    });

    return NextResponse.json({ message: "تمت الإضافة بنجاح", admin: createdAdmin }, { status: 201 });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "فشل الاتصال بقاعدة البيانات. تأكد من إعدادات MONGODB_URI في Vercel" }, { status: 500 });
  }
}
