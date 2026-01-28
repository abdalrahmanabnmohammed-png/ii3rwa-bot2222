"use client";
import { useState, useEffect } from "react";

export default function SecurityPage() {
  const [config, setConfig] = useState(null);
  const [channels, setChannels] = useState([]);
  const [roles, setRoles] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/security').then(res => res.json()),
      fetch('/api/guild/channels').then(res => res.json()),
      fetch('/api/guild/roles').then(res => res.json())
    ]).then(([secData, chanData, rolesData]) => {
      setConfig(secData);
      setChannels(chanData.channels || []);
      setRoles(rolesData.roles || []);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/security', {
      method: 'POST',
      body: JSON.stringify(config)
    });
    alert("✅ تم حفظ إعدادات الحماية بنجاح!");
    setSaving(false);
  };

  if (!config) return <div className="p-10 text-white text-center">جاري تحميل مركز الحماية...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12" dir="rtl">
      <h1 className="text-3xl font-black mb-10">🛡️ مركز <span className="text-[#A62DC9]">الحماية المتقدمة</span></h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* السبام والكلمات المسيئة */}
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-6">
           <div className="flex justify-between items-center">
             <h2 className="text-xl font-bold">نظام السبام والتكرار</h2>
             <input type="checkbox" className="accent-[#A62DC9] w-6 h-6" checked={config.spamDetection} onChange={e => setConfig({...config, spamDetection: e.target.checked})} />
           </div>
           <hr className="border-white/5" />
           <div className="flex justify-between items-center">
             <h2 className="text-xl font-bold">فلتر الكلمات المسيئة</h2>
             <input type="checkbox" className="accent-[#A62DC9] w-6 h-6" checked={config.badWords} onChange={e => setConfig({...config, badWords: e.target.checked})} />
           </div>
           <textarea 
            className="w-full bg-black p-3 rounded-xl text-sm border border-white/5 h-20 outline-none"
            placeholder="الكلمات الممنوعة (مثال: كلمة1, كلمة2...)"
            value={config.blockedWords?.join(', ')}
            onChange={e => setConfig({...config, blockedWords: e.target.value.split(', ')})}
          />
        </div>

        {/* الروابط والبوتات */}
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
          <h2 className="text-xl font-bold mb-4 italic">الروابط والبوتات</h2>
          <label className="flex items-center gap-3 mb-6 p-3 bg-black/40 rounded-xl cursor-pointer">
            <input type="checkbox" checked={config.linkProtection} onChange={e => setConfig({...config, linkProtection: e.target.checked})} />
            <span>تفعيل حماية الروابط</span>
          </label>
          <p className="text-xs text-gray-500 mb-2 font-bold uppercase">الرتب المسموح لها بتخطي الحماية:</p>
          <select multiple className="w-full bg-black p-3 rounded-xl h-24 border border-white/5 outline-none">
            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>

        {/* التحقق البشري و اللوق */}
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">التحقق البشري (Captcha)</h2>
            <input type="checkbox" checked={config.captchaVerification} onChange={e => setConfig({...config, captchaVerification: e.target.checked})} />
          </div>
          <select 
            className="w-full bg-black p-3 rounded-xl border border-white/5 outline-none"
            value={config.verificationChannel} onChange={e => setConfig({...config, verificationChannel: e.target.value})}
          >
            <option value="">-- اختر قناة التحقق --</option>
            {channels.map(ch => <option key={ch.id} value={ch.id}># {ch.name}</option>)}
          </select>

          <hr className="border-white/5" />
          
          <h2 className="text-xl font-bold">قناة السجلات (Logs)</h2>
          <select 
            className="w-full bg-black p-3 rounded-xl border border-white/5 outline-none"
            value={config.logChannelId} onChange={e => setConfig({...config, logChannelId: e.target.value})}
          >
            <option value="">-- اختر قناة اللوق --</option>
            {channels.map(ch => <option key={ch.id} value={ch.id}># {ch.name}</option>)}
          </select>
        </div>

        {/* حماية الويب هوك والوهميين */}
        <div className="bg-[#A62DC9]/5 p-6 rounded-3xl border border-[#A62DC9]/20 space-y-4">
           <h2 className="text-xl font-black text-[#A62DC9] mb-4 uppercase italic">Security Shield</h2>
           <label className="flex justify-between p-4 bg-black/50 rounded-2xl cursor-pointer">
             <span>حماية الويب هوك (Webhooks)</span>
             <input type="checkbox" checked={config.webhookProtection} onChange={e => setConfig({...config, webhookProtection: e.target.checked})} />
           </label>
           <label className="flex justify-between p-4 bg-black/50 rounded-2xl cursor-pointer">
             <span>منع الحسابات الوهمية</span>
             <input type="checkbox" checked={config.fakeAccountProtection} onChange={e => setConfig({...config, fakeAccountProtection: e.target.checked})} />
           </label>
        </div>
      </div>

      <button 
        onClick={handleSave} disabled={saving}
        className="fixed bottom-10 left-10 bg-[#A62DC9] px-12 py-4 rounded-full font-black shadow-2xl hover:scale-105 active:scale-95 transition-all z-50"
      >
        {saving ? "جاري الحفظ..." : "حفظ التغييرات 🛡️"}
      </button>
    </div>
  );
}
