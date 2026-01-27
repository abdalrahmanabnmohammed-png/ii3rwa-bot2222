"use client";
import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative" dir="rtl">
      {/* خلفية مضيئة (Glow Effect) */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#A62DC9] opacity-10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 opacity-10 blur-[120px] rounded-full"></div>

      <main className="relative z-10 container mx-auto px-6 py-20 text-center">
        {/* الشعار والترحيب */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            ii3RwA <span className="text-[#A62DC9]">System</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            النظام الأقوى لإدارة وحماية سيرفرات قنوات اليوتيوب الكبيرة. تحكم كامل، سرعة فائقة، وأمان لا يضاهى.
          </p>
        </div>

        {/* إحصائيات وهمية جذابة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:scale-105 transition">
            <h3 className="text-4xl font-bold text-[#A62DC9]">+150K</h3>
            <p className="text-gray-400 mt-2">عضو محمي</p>
          </div>
          <div className="p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:scale-105 transition">
            <h3 className="text-4xl font-bold text-blue-500">+1.2M</h3>
            <p className="text-gray-400 mt-2">رسالة سبام محذوفة</p>
          </div>
          <div className="p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:scale-105 transition">
            <h3 className="text-4xl font-bold text-green-500">99.9%</h3>
            <p className="text-gray-400 mt-2">وقت تشغيل (Uptime)</p>
          </div>
        </div>

        {/* زر الدخول */}
        <a href="/login" className="inline-block px-12 py-5 bg-[#A62DC9] hover:bg-[#8e24ab] text-white font-bold text-2xl rounded-2xl shadow-[0_0_30px_rgba(166,45,201,0.4)] transition-all transform hover:-translate-y-2">
          الدخول للوحة التحكم 🔐
        </a>
      </main>
    </div>
  );
}
