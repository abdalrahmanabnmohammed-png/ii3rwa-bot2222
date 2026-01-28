"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SecurityCommands() {
  const router = useRouter();
  const [antiLink, setAntiLink] = useState(false);
  const [antiSpam, setAntiSpam] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.push('/dashboard')} className="mb-8 text-gray-500 hover:text-[#A62DC9] font-bold">← العودة للوحة الرئيسية</button>
        
        <header className="mb-12">
          <h1 className="text-3xl font-black italic">أوامر <span className="text-red-500">الحماية</span></h1>
          <p className="text-gray-500">تحكم في سلوك البوت داخل السيرفر</p>
        </header>

        <div className="grid gap-6">
          {/* كرت منع الروابط */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex justify-between items-center transition-all hover:border-red-500/30">
            <div>
              <h3 className="text-xl font-bold mb-1">منع الروابط (Anti-Link)</h3>
              <p className="text-sm text-gray-500">حذف الرسائل التي تحتوي على روابط تلقائياً.</p>
            </div>
            <button 
              onClick={() => setAntiLink(!antiLink)}
              className={`w-16 h-8 rounded-full relative transition-all ${antiLink ? 'bg-red-500' : 'bg-gray-700'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${antiLink ? 'left-1' : 'left-9'}`} />
            </button>
          </div>

          {/* كرت منع السبام */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex justify-between items-center transition-all hover:border-red-500/30">
            <div>
              <h3 className="text-xl font-bold mb-1">منع التكرار (Anti-Spam)</h3>
              <p className="text-sm text-gray-500">حظر العضو مؤقتاً عند تكرار نفس الرسالة.</p>
            </div>
            <button 
              onClick={() => setAntiSpam(!antiSpam)}
              className={`w-16 h-8 rounded-full relative transition-all ${antiSpam ? 'bg-red-500' : 'bg-gray-700'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${antiSpam ? 'left-1' : 'left-9'}`} />
            </button>
          </div>
        </div>

        <button className="w-full mt-10 bg-red-500 py-4 rounded-2xl font-black hover:shadow-[0_0_20px_-5px_red] transition-all">
          تحديث إعدادات البوت ⚡
        </button>
      </div>
    </div>
  );
}
