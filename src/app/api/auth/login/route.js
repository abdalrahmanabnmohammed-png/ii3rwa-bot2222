import { NextResponse } from "next/server";

export async function POST(request) {
    const { username, password } = await request.json();

    // هنا يتم الفحص مع المتغيرات التي وضعتها في Vercel
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ success: false, message: "بيانات خاطئة" }, { status: 401 });
}
