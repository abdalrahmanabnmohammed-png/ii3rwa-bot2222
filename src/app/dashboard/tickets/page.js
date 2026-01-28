"use client";
import { useState, useEffect } from "react";

export default function TicketSystemPage() {
  const [config, setConfig] = useState(null);
  const [channels, setChannels] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newReason, setNewReason] = useState("");

  useEffect(() => {
    Promise.all([
      fetch('/api/tickets').then(res => res.json()),
      fetch('/api/guild/channels').then(res => res.json()),
      fetch('/api/guild/roles').then(res => res.json())
    ]).then(([ticketData, chanData, rolesData]) => {
      setConfig(ticketData);
      setChannels(chanData.channels || []);
      setRoles(rolesData.roles || []);
    });
  }, []);

  const save = async () => {
    await fetch('/api/tickets', {
      method: 'POST',
      body: JSON.stringify(config)
    });
    alert("✅ تم حفظ إعدادات التذاكر بنجاح!");
  };

  if (!config) return <div className="p-10 text-white text-center">جاري تحميل نظام التذاكر...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12" dir="rtl">
      <h1 className="text-3xl font-black mb-10 italic">نظام <span className="text-[#A62DC9]">التذاكر الاحترافي</span> 🎫</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* إعدادات القنوات والرتب */}
        <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-6">
          <h2 className="text-xl font-bold mb-4">الإعدادات الأساسية</h2>
          
          <div>
            <label className="text-xs text-gray-500 block mb-2 font-bold uppercase">روم رسالة الفتح (Embed):</label>
            <select className="w-full bg-black p-4 rounded-2xl border border-white/5 outline-none" value={config.setupChannelId} onChange={e => setConfig({...config, setupChannelId: e.target.value})}>
              <option value="">اختر القناة...</option>
              {channels.map(ch => <option key={ch.id} value={ch.id}># {ch.name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-2 font-bold uppercase">روم حفظ السجلات (Transcripts):</label>
            <select className="w-full bg-black p-4 rounded-2xl border border-white/5 outline-none" value={config.logChannelId} onChange={e => setConfig({...config, logChannelId: e.target.value})}>
              <option value="">اختر القناة...</option>
              {channels.map(ch => <option key={ch.id} value={ch.id}># {ch.name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-2 font-bold uppercase">الرتبة المسؤولة عن الاستلام:</label>
            <select className="w-full bg-black p-4 rounded-2xl border border-white/5 outline-none" value={config.supportRoleId} onChange={e => setConfig({...config, supportRoleId: e.target.value})}>
              <option value="">اختر الرتبة...</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
        </div>

        {/* أسباب فتح التذكرة */}
        <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
          <h2 className="text-xl font-bold mb-6">أسباب فتح التذاكر (Menu Options)</h2>
          <div className="flex gap-2 mb-6">
            <input 
              className="flex-1 bg-black p-4 rounded-xl border border-white/5 outline-none"
              placeholder="أضف سبب جديد (مثال: بلاغ)" 
              value={newReason} onChange={e => setNewReason(e.target.value)}
            />
            <button 
              onClick={() => {
                if(!newReason) return;
                setConfig({...config, reasons: [...config.reasons, newReason]});
                setNewReason("");
              }}
              className="bg-[#A62DC9] px-6 rounded-xl font-bold"
            >إضافة</button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {config.reasons.map((res, i) => (
              <div key={i} className="flex justify-between bg-black/40 p-3 rounded-xl border border-white/5">
                <span>{res}</span>
                <button className="text-red-500 text-sm" onClick={() => setConfig({...config, reasons: config.reasons.filter((_, idx) => idx !== i)})}>حذف</button>
              </div>
            ))}
          </div>
        </div>

        {/* تفعيل الخصائص المتقدمة */}
        <div className="lg:col-span-2 bg-[#A62DC9]/5 p-8 rounded-[2.5rem] border border-[#A62DC9]/20 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-black text-[#A62DC9] uppercase text-sm tracking-widest">Logic Control</h3>
            <label className="flex justify-between items-center p-4 bg-black/50 rounded-2xl">
              <span>تحديد تذكرة واحدة لكل عضو</span>
              <input type="checkbox" className="w-6 h-6 accent-[#A62DC9]" checked={true} readOnly />
            </label>
            <label className="flex justify-between items-center p-4 bg-black/50 rounded-2xl">
              <span>نظام الترقيم المتسلسل (#0001)</span>
              <input type="checkbox" className="w-6 h-6 accent-[#A62DC9]" checked={true} readOnly />
            </label>
          </div>
          <div className="space-y-4">
            <h3 className="font-black text-[#A62DC9] uppercase text-sm tracking-widest">Admin Actions</h3>
            <label className="flex justify-between items-center p-4 bg-black/50 rounded-2xl">
              <span>قفل الشات عند استلام الإداري</span>
              <input type="checkbox" className="w-6 h-6 accent-[#A62DC9]" checked={true} readOnly />
            </label>
            <label className="flex justify-between items-center p-4 bg-black/50 rounded-2xl">
              <span>منشن الإدارة عند ترك التذكرة</span>
              <input type="checkbox" className="w-6 h-6 accent-[#A62DC9]" checked={true} readOnly />
            </label>
          </div>
        </div>

      </div>

      <button onClick={save} className="w-full mt-8 bg-[#A62DC9] p-6 rounded-[2.5rem] font-black text-xl hover:scale-[1.01] transition-all shadow-xl shadow-[#A62DC9]/20">
        حفظ وتفعيل نظام التذاكر المتكامل 🎫
      </button>
    </div>
  );
}
