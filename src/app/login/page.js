"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SecurityPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [antiLink, setAntiLink] = useState(false);
  const [antiSpam, setAntiSpam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // معرف السيرفر (يمكنك تغييره لاحقاً ليكون ديناميكياً)
  const guildId = "123456789"; 

  // 1. حماية الصفحة من الدخول المباشر
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin === "true") {
      setAuthorized(true);
    } else {
      router.push('/login'); // طرد المستخدم إذا لم يسجل دخوله
    }
  }, [router]);

  // 2. دالة حفظ الإعدادات في MongoDB
  const saveSettings = async () => {
    setLoading(true);
    setStatus("جاري الحفظ في القاعدة...");
    
    try {
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guildId,
          settings: { antiLink, antiSpam }
        }),
      });

      if (response.ok) {
        setStatus("✅ تم تحديث إعدادات البوت بنجاح!");
      } else {
        setStatus("❌ فشل الاتصال بالقاعدة.");
      }
    } catch (error) {
      setStatus("❌ حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 4000);
    }
  };

  // 3. دالة تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    window.location.href = '/login';
  };

  // إذا لم يكن مخولاً، لا نعرض شيئاً حتى يتم التحويل
  if (!authorized) return <div className="bg-black min-h-screen"></div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 relative overflow-hidden" dir="rtl">
      
      {/* خلفية ضوئية */}
      <div className="absolute top-[-10%] right-[-5%] w-80 h-80 bg-[#A62DC9] opacity-10 blur-[100px] rounded-full"></div>

      {/* زر تسجيل الخروج */}
      <button 
        onClick={handleLogout}
        className="fixed top-6 left-6 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-5 py-2 rounded-xl border border-red-500/20 transition-all font-bold text-sm z-50"
      >
        تسجيل الخروج 🚪
      </button>

      <header className="max-w-4xl mx-auto mb-16 text-center animate-fade-in">
        <h1 className="text-4xl font-black text-white mb-3">
          تحكم الحماية <span className="text-[#A62DC9]">ii3RwA</span>
        </h1>
        <p className="text-gray-400 font-medium">قم بتعديل خصائص البوت وسيقوم بتنفيذها فوراً في الديسكورد.</p>
      </header>

      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        
        {/* بطاقة منع الروابط */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] flex justify-between items-center group hover:border-[#A62DC9]/50 transition-all">
          <div>
            <h3 className="text-xl font-bold mb-1">نظام منع الروابط 🔗</h3>
            <p className="text-gray-500 text-sm">سيقوم البوت بحذف أي رابط يتم إرساله.</p>
          </div>
          <button 
            onClick={() => setAntiLink(!antiLink)}
            className={`w-16 h-9 flex items-center rounded-full p-1 transition-colors duration-300 ${antiLink ? 'bg-[#A62DC9]' : 'bg-gray-700'}`}
          >
            <div className={`bg-white w-7 h-7 rounded-full shadow-lg transform transition-transform duration-300 ${antiLink ? '-translate-x-7' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* بطاقة منع السبام */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] flex justify-between items-center group hover:border-[#A62DC9]/50 transition-all">
          <div>
            <h3 className="text-xl font-bold mb-1">نظام منع التكرار ⚡</h3>
            <p className="text-gray-500 text-sm">حماية السيرفر من الرسائل المتكررة.</p>
          </div>
          <button 
            onClick={() => setAntiSpam(!antiSpam)}
            className={`w-16 h-9 flex items-center rounded-full p-1 transition-colors duration-300 ${antiSpam ? 'bg-[#A62DC9]' : 'bg-gray-700'}`}
          >
            <div className={`bg-white w-7 h-7 rounded-full shadow-lg transform transition-transform duration-300 ${antiSpam ? '-translate-x-7' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* زر الحفظ */}
        <div className="pt-6">
          <button 
            onClick={saveSettings}
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all transform active:scale-95 ${
              loading 
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
              : 'bg-[#A62DC9] hover:bg-[#8e24ab] text-white shadow-[#A62DC9]/20'
            }`}
          >
            {loading ? 'انتظر قليلاً...' : 'حفظ التعديلات الآن'}
          </button>
          
          {status && (
            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-center animate-bounce text-sm font-bold">
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
