"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdvancedWelcomePage() {
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/welcome').then(res => res.json()).then(data => setConfig(data));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    alert("✅ تم حفظ إعدادات الترحيب بالصورة!");
    setSaving(false);
  };

  if (!config) return <div className="min-h-screen bg-black flex items-center justify-center text-[#A62DC9]">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-black italic italic">نظام <span className="text-[#A62DC9]">الترحيب بالصور</span> ✨</h1>
          <button onClick={() => router.push('/dashboard')} className="bg-white/5 px-6 py-2 rounded-xl text-sm border border-white/10 hover:bg-white/10 transition-all">العودة للوحة ←</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* بطاقة الإعدادات العامة */}
          <div className="space-y-6">
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl">الحالة العامة</h3>
                <input 
                  type="checkbox" className="w-12 h-6 accent-[#A62DC9]"
                  checked={config.status} onChange={e => setConfig({...config, status: e.target.checked})} 
                />
              </div>
              <label className="block text-sm text-gray-500 mb-2">قناة الترحيب:</label>
              <input 
                className="w-full bg-black p-4 rounded-2xl border border-white/5 outline-none mb-4"
                value={config.channelId} onChange={e => setConfig({...config, channelId: e.target.value})}
                placeholder="Channel ID"
              />
            </div>

            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <h3 className="font-bold text-xl mb-4 text-[#A62DC9]">رسالة الترحيب النصية</h3>
              <textarea 
                className="w-full bg-black p-4 rounded-2xl border border-white/5 outline-none h-32 resize-none"
                value={config.message} onChange={e => setConfig({...config, message: e.target.value})}
              />
            </div>
          </div>

          {/* بطاقة الترحيب بالصورة */}
          <div className="bg-white/5 p-8 rounded-[3rem] border border-[#A62DC9]/30 relative overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-xl">تفعيل نظام الصور</h3>
              <input 
                type="checkbox" className="w-12 h-6 accent-[#A62DC9]"
                checked={config.useImage} onChange={e => setConfig({...config, useImage: e.target.checked})} 
              />
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs text-gray-500 mb-2 uppercase font-black">رابط خلفية الترحيب:</label>
                <input 
                  className="w-full bg-black p-4 rounded-xl border border-white/5"
                  value={config.backgroundUrl} onChange={e => setConfig({...config, backgroundUrl: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-2 font-black">عنوان الصورة:</label>
                  <input 
                    className="w-full bg-black p-4 rounded-xl border border-white/5"
                    value={config.welcomeTitle} onChange={e => setConfig({...config, welcomeTitle: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-2 font-black">لون النص:</label>
                  <input 
                    type="color" className="w-full h-[58px] bg-black p-2 rounded-xl border border-white/5 cursor-pointer"
                    value={config.textColor} onChange={e => setConfig({...config, textColor: e.target.value})}
                  />
                </div>
              </div>

              {/* معاينة بسيطة لشكل الكرت */}
              <div className="mt-8 relative rounded-2xl overflow-hidden border-2 border-dashed border-white/10 aspect-video flex items-center justify-center">
                <img src={config.backgroundUrl} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="preview" />
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-[#A62DC9] mx-auto mb-2 bg-gray-800"></div>
                  <p style={{ color: config.textColor }} className="font-black text-xl">{config.welcomeTitle}</p>
                  <p className="text-[10px] text-gray-400">User Name#0000</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <button 
          onClick={handleSave} disabled={saving}
          className="w-full mt-10 bg-[#A62DC9] p-6 rounded-[2.5rem] font-black text-2xl hover:scale-[1.01] transition-all shadow-xl shadow-[#A62DC9]/20"
        >
          {saving ? "جاري الحفظ..." : "حفظ إعدادات الترحيب المتقدمة 🚀"}
        </button>
      </div>
    </div>
  );
}
