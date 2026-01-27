"use client";
import React, { useState, useEffect } from 'react';

export default function SecurityPage() {
  const [antiLink, setAntiLink] = useState(false);
  const [antiSpam, setAntiSpam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // معرف السيرفر (يجب أن يتم جلبه ديناميكياً لاحقاً، حالياً سنستخدم رقم تجريبي)
  const guildId = "123456789"; 

  // دالة حفظ الإعدادات
  const saveSettings = async () => {
    setLoading(true);
    setStatus("جاري الحفظ...");
    
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
        setStatus("✅ تم الحفظ بنجاح!");
      } else {
        setStatus("❌ فشل الحفظ، حاول مرة أخرى.");
      }
    } catch (error) {
      setStatus("❌ حدث خطأ في الاتصال.");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 3000); // إخفاء الرسالة بعد 3 ثوانٍ
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8" dir="rtl">
      <header className="mb-10 border-b border-gray-800 pb-5 text-center">
        <h1 className="text-3xl font-bold text-purple-500">إعدادات حماية السيرفر 🛡️</h1>
      </header>

      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* نظام منع الروابط */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">منع الروابط (Anti-Link)</h3>
          </div>
          <button 
            onClick={() => setAntiLink(!antiLink)}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${antiLink ? 'bg-green-500' : 'bg-gray-600'}`}
          >
            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${antiLink ? '-translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* نظام منع التكرار */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">منع التكرار (Anti-Spam)</h3>
          </div>
          <button 
            onClick={() => setAntiSpam(!antiSpam)}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${antiSpam ? 'bg-green-500' : 'bg-gray-600'}`}
          >
            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${antiSpam ? '-translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* زر الحفظ ورسالة الحالة */}
        <div className="text-center pt-4">
          <button 
            onClick={saveSettings}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-lg transition ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/30'}`}
          >
            {loading ? 'انتظر...' : 'حفظ التعديلات الآن'}
          </button>
          {status && <p className="mt-4 text-sm font-medium animate-pulse">{status}</p>}
        </div>

      </div>
    </div>
  );
}
