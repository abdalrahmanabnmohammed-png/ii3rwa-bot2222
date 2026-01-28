import connectMongo from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// آيدي السيرفر الخاص بك
const GUILD_ID = "1349181448099336303"; 

// 1. جلب الإعدادات الحالية للنظام (GET)
export async function GET() {
  try {
    await connectMongo();
    let config = await Ticket.findOne({ guildId: GUILD_ID });
    
    // إذا لم تكن هناك إعدادات مسبقة، يتم إنشاء نسخة افتراضية
    if (!config) {
      config = await Ticket.create({ 
        guildId: GUILD_ID, 
        reasons: ["دعم فني", "استفسار", "شكوى"],
        status: false 
      });
    }
    
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: "فشل جلب إعدادات التذاكر" }, { status: 500 });
  }
}

// 2. حفظ الإعدادات وإرسال رسالة الفتح للسيرفر (POST)
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    // التحقق من تسجيل الدخول
    if (!session) {
      return NextResponse.json({ error: "يجب تسجيل الدخول أولاً" }, { status: 401 });
    }

    const body = await req.json();
    await connectMongo();

    // تحديث الإعدادات في MongoDB
    const updatedConfig = await Ticket.findOneAndUpdate(
      { guildId: GUILD_ID },
      { ...body },
      { upsert: true, new: true }
    );

    // --- إرسال رسالة التذاكر إلى ديسكورد مباشرة ---
    if (body.setupChannelId && body.reasons && body.reasons.length > 0) {
      
      const discordEmbed = {
        title: "🎫 مركز فتح التذاكر | ii3RwA System",
        description: "يرجى اختيار القسم المناسب من القائمة أدناه للتحدث مع فريق الدعم.\n\n**ملاحظة:** يمنع فتح أكثر من تذكرة في نفس الوقت.",
        color: 0xA62DC9, // اللون البنفسجي الخاص بمتجركم
        footer: { text: "ii3RwA Control Panel • 2026" },
        timestamp: new Date().toISOString()
      };

      const selectMenuComponent = [
        {
          type: 1, // Action Row
          components: [
            {
              type: 3, // String Select Menu
              custom_id: "ticket_reasons",
              placeholder: "اختر سبب التذكرة من هنا...",
              options: body.reasons.map(reason => ({
                label: reason,
                value: reason,
                description: `فتح تذكرة بخصوص ${reason}`,
                emoji: { name: "📩" }
              }))
            }
          ]
        }
      ];

      // إرسال الطلب لـ Discord API
      const discordResponse = await fetch(`https://discord.com/api/v10/channels/${body.setupChannelId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: [discordEmbed],
          components: selectMenuComponent
        }),
      });

      if (!discordResponse.ok) {
        console.error("فشل إرسال الرسالة لديسكورد، تأكد من التوكن وصلاحيات البوت");
      }
    }

    return NextResponse.json({ 
      message: "تم حفظ الإعدادات وإرسال رسالة التذاكر بنجاح!", 
      config: updatedConfig 
    });

  } catch (error) {
    console.error("Ticket API Error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء المعالجة" }, { status: 500 });
  }
}
