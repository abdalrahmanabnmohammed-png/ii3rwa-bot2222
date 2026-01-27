import connectMongo from "@/lib/mongodb";
import Security from "@/models/Security";
import { NextResponse } from "next/server";

// دالة لجلب البيانات (GET) لإظهار الإعدادات الحالية في الموقع
export async function GET(request) {
    try {
        await connectMongo();
        const { searchParams } = new URL(request.url);
        const guildId = searchParams.get("guildId");

        const settings = await Security.findOne({ guildId });
        return NextResponse.json(settings || { message: "لا توجد إعدادات لهذا السيرفر" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "فشل في جلب البيانات" }, { status: 500 });
    }
}

// دالة لتحديث البيانات (POST) عند الضغط على زر الحفظ
export async function POST(request) {
    try {
        await connectMongo();
        const data = await request.json();
        const { guildId, settings } = data;

        // تحديث الإعدادات أو إنشاؤها إذا لم تكن موجودة (Upsert)
        const updatedSettings = await Security.findOneAndUpdate(
            { guildId },
            { $set: { settings, updatedAt: Date.now() } },
            { upsert: true, new: true }
        );

        return NextResponse.json({ message: "تم حفظ الإعدادات بنجاح", data: updatedSettings }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "فشل في حفظ البيانات" }, { status: 500 });
    }
}
