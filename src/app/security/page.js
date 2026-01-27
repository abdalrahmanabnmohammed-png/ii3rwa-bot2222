"use client";
import React, { useState } from 'react';

export default function SecurityPage() {
  const [antiLink, setAntiLink] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-10" dir="rtl">
      <h1 className="text-3xl font-black mb-8">لوحة تحكم الحماية 🛡️</h1>
      <div className="max-w-xl bg-white/5 p-8 rounded-3xl border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <span>تفعيل منع الروابط</span>
          <button 
            onClick={() => setAntiLink(!antiLink)}
            className={`w-14 h-8 rounded-full transition-all ${antiLink ? 'bg-[#A62DC9]' : 'bg-gray-700'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full transition-all transform ${antiLink ? 'translate-x-1' : 'translate-x-7'}`} />
          </button>
        </div>
        <button className="w-full bg-[#A62DC9] py-3 rounded-xl font-bold">حفظ الإعدادات</button>
      </div>
    </div>
  );
}
