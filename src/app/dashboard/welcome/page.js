"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WelcomeConfigPage() {
  const [config, setConfig] = useState({ channelId: "", message: "", status: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/welcome')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch('/api/welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    if (res.ok) alert("✅ تم تحديث نظام الترحيب بنجاح!");
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#A62DC9]">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 md:p-16" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.push('/dashboard')} className="text-gray-500 mb-8 hover:text-white">← العودة للوحة التحكم</button>
        
        <h1 className="text-4xl font-black mb-10 italic">نظام <span className="text-[#A62DC9]">الترحيب التلقائي</span> ✨</h1>

        <div className="space-y-8">
          {/* كرت الحالة */}
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-xl">حالة النظام</h3>
              <p className="text-gray-500 text-sm">تفعيل أو تعطيل رسائل الترحيب</p>
            </div>
            <button 
              onClick={() => setConfig({...config, status: !config.status})}
              className={`px-8 py-3 rounded-2xl font-black transition-all ${config.status ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
            >
              {config.status ? "مـفـعـل" : "مـعـطـل"}
            </button>
          </div>

          {/* قناة الترحيب */}
          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
            <label className="block font-bold mb-4 text-gray-300">آيدي قناة الترحيب (Channel ID):</label>
            <input 
              className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#A62DC9]"
              value={config.channelId}
              onChange={(e) => setConfig({...config, channelId: e.target.value})}
              placeholder="مثال: 1349181448099336303"
            />
          </div>

          {/* رسالة الترحيب */}
          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
            <label className="block font-bold mb-4 text-gray-300">نص رسالة الترحيب:</label>
            <textarea 
              className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#A62DC9] h-40 resize-none"
              value={config.message}
              onChange={(e) => setConfig({...config, message: e.target.value})}
              placeholder="استخدم {user} لذكر العضو الجديد..."
            />
            <p className="text-[10px] text-gray-600 mt-4 uppercase font-black tracking-widest">تلميح: {`{user}`} سيتم استبدالها باسم العضو تلقائياً.</p>
          </div>

          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[#A62DC9] p-5 rounded-[2rem] font-black text-xl shadow-lg shadow-[#A62DC9]/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            {saving ? "جاري الحفظ..." : "حفظ الإعدادات وتطبيقها 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}
