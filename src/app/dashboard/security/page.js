"use client";
import React, { useState } from 'react';

export default function AntiLinkPage() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-10" dir="rtl">
      <h1 className="text-3xl font-black mb-8 italic">نظام <span className="text-[#A62DC9]">منع الروابط</span></h1>
      
      <div className="max-w-2xl bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl">
        <p className="text-gray-400 mb-8">عند تفعيل هذه الخاصية، سيقوم البوت بحذف أي رابط يتم إرساله في السيرفر فوراً.</p>
        
        <div className="flex justify-between items-center bg-black/50 p-6 rounded-2xl border border-[#A62DC9]/20">
          <span className="font-bold">حالة النظام: {enabled ? "مفعل ✅" : "معطل ❌"}</span>
          <button 
            onClick={() => setEnabled(!enabled)}
            className={`px-8 py-3 rounded-xl font-black transition-all ${enabled ? 'bg-green-500/20 text-green-500 border border-green-500/50' : 'bg-red-500/20 text-red-500 border border-red-500/50'}`}
          >
            {enabled ? "إيقاف" : "تشغيل"}
          </button>
        </div>
        
        <button className="w-full mt-10 bg-[#A62DC9] py-4 rounded-2xl font-black hover:scale-[1.02] transition-transform shadow-lg shadow-[#A62DC9]/20">
          حفظ التغييرات في السيرفر
        </button>
      </div>
    </div>
  );
}
