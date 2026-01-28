"use client";
import { useState, useEffect } from "react";

export default function SecurityPage() {
  const [config, setConfig] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetch('/api/security').then(res => res.json()).then(data => setConfig(data));
    fetch('/api/guild/roles').then(res => res.json()).then(data => setRoles(data.roles || []));
  }, []);

  const save = async () => {
    await fetch('/api/security', {
      method: 'POST',
      body: JSON.stringify(config)
    });
    alert("✅ تم حفظ إعدادات الحماية بنجاح!");
  };

  if (!config) return <div className="p-10 text-white">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12" dir="rtl">
      <h1 className="text-3xl font-black mb-10">🛡️ مركز <span className="text-[#A62DC9]">الحماية المتقدمة</span></h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1 & 7: السبام والتكرار */}
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">السبام والتكرار</h2>
            <input type="checkbox" checked={config.spamDetection} onChange={e => setConfig({...config, spamDetection: e.target.checked})} />
          </div>
          <p className="text-gray-400 text-sm">منع تكرار الرسائل والسبام السريع.</p>
        </div>

        {/* 2: الكلمات المسيئة */}
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">الكلمات المسيئة</h2>
            <input type="checkbox" checked={config.badWords} onChange={e => setConfig({...config, badWords: e.target.checked})} />
          </div>
          <textarea 
            className="w-full bg-black p-3 rounded-xl text-sm border border-white/5"
            placeholder="ضع الكلمات هنا مفصولة بفاصلة..."
            value={config.blockedWords?.join(', ')}
            onChange={e => setConfig({...config, blockedWords: e.target.value.split(', ')})}
          />
        </div>

        {/* 3 & 5: حماية الروابط والبوتات */}
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
          <h2 className="text-xl font-bold mb-4">الروابط والبوتات</h2>
          <div className="space-y-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={config.linkProtection} onChange={e => setConfig({...config, linkProtection: e.target.checked})} />
              منع الروابط لغير المسموح لهم
            </label>
            <label className="block text-xs text-gray-500">الرتب المسموح لها بالروابط وبإضافة بوتات:</label>
            <select multiple className="w-full bg-black p-2 rounded-xl h-24 border border-white/5">
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
        </div>

        {/* 4 & 6: الوهميين والويب هوك */}
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
          <h2 className="text-xl font-bold mb-4">دخول السيرفر</h2>
          <div className="space-y-4">
            <label className="flex justify-between items-center">
              <span>منع الحسابات الوهمية (أقل من 7 أيام)</span>
              <input type="checkbox" checked={config.fakeAccountProtection} onChange={e => setConfig({...config, fakeAccountProtection: e.target.checked})} />
            </label>
            <label className="flex justify-between items-center">
              <span>تصفية الويب هوك (Webhooks)</span>
              <input type="checkbox" checked={config.webhookProtection} onChange={e => setConfig({...config, webhookProtection: e.target.checked})} />
            </label>
          </div>
        </div>

        {/* 8: التحقق البشري */}
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">التحقق البشري (Captcha)</h2>
            <input type="checkbox" checked={config.captchaVerification} onChange={e => setConfig({...config, captchaVerification: e.target.checked})} />
          </div>
          <input className="w-full bg-black p-3 rounded-xl border border-white/5 text-sm" placeholder="ID قناة التحقق" />
        </div>

        {/* 9: اللوق */}
        <div className="bg-[#A62DC9]/10 p-6 rounded-3xl border border-[#A62DC9]/20">
          <h2 className="text-xl font-bold mb-4 text-[#A62DC9]">سجلات الحماية (Logs)</h2>
          <input 
            className="w-full bg-black p-3 rounded-xl border border-white/5 mb-4" 
            placeholder="ID قناة اللوق في ديسكورد" 
            value={config.logChannelId}
            onChange={e => setConfig({...config, logChannelId: e.target.value})}
          />
          <div className="h-24 overflow-y-auto text-xs space-y-2">
            {config.dashboardLogs?.map((log, i) => (
              <p key={i} className="text-gray-400">[{new Date(log.timestamp).toLocaleDateString()}] {log.action}</p>
            )).reverse()}
          </div>
        </div>
      </div>

      <button 
        onClick={save}
        className="fixed bottom-10 left-10 bg-[#A62DC9] px-10 py-4 rounded-2xl font-black shadow-2xl hover:scale-105 transition-all"
      >
        حفظ الإعدادات الشاملة 🛡️
      </button>
    </div>
  );
}
