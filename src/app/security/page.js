"use client";
import React, { useState } from 'react';

export default function SecurityPage() {
  // حالة الأزرار (في مشروعك الحقيقي ستجلب هذه البيانات من قاعدة البيانات)
  const [antiLink, setAntiLink] = useState(false);
  const [antiSpam, setAntiSpam] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8" dir="rtl">
      <header className="mb-10 border-b border-gray-800 pb-5">
        <h1 className="text-3xl font-bold text-purple-500">لوحة تحكم بوت الحماية 🛡️</h1>
        <p className="text-gray-400 mt-2">إدارة أمن السيرفر وحمايته من الروابط والمزعجين.</p>
      </header>

      <div className="max-w-4xl mx-auto grid gap-6">
        
        {/* بطاقة منع الروابط */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">نظام منع الروابط (Anti-Link)</h3>
            <p className="text-gray-400 text-sm">حذف أي رابط يتم إرساله من قبل الأعضاء تلقائياً.</p>
          </div>
          <button 
            onClick={() => setAntiLink(!antiLink)}
            className={`px-6 py-2 rounded-full font-bold transition ${antiLink ? 'bg-green-600' : 'bg-red-600'}`}
          >
            {antiLink ? 'مفعل' : 'معطل'}
          </button>
        </div>

        {/* بطاقة منع السبام */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">نظام منع التكرار (Anti-Spam)</h3>
            <p className="text-gray-400 text-sm">منع إرسال الرسائل المتكررة بسرعة كبيرة.</p>
          </div>
          <button 
            onClick={() => setAntiSpam(!antiSpam)}
            className={`px-6 py-2 rounded-full font-bold transition ${antiSpam ? 'bg-green-600' : 'bg-red-600'}`}
          >
            {antiSpam ? 'مفعل' : 'معطل'}
          </button>
        </div>

        {/* زر الحفظ */}
        <button className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-purple-500/20">
          حفظ التعديلات
        </button>

      </div>
    </div>
  );
}
