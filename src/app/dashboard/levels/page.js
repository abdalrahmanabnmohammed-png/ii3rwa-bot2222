"use client";
import { useState, useEffect } from "react";

export default function LevelingPage() {
  const [config, setConfig] = useState({ levelRoles: [], isEnabled: false });
  const [roles, setRoles] = useState([]);
  const [newLevel, setNewLevel] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");

  useEffect(() => {
    fetch('/api/levels').then(res => res.json()).then(data => setConfig(data));
    fetch('/api/guild/roles').then(res => res.json()).then(data => setRoles(data.roles || []));
  }, []);

  const addLevelRole = () => {
    if (!newLevel || !selectedRoleId) return alert("يرجى تعبئة الحقول");
    const updatedRoles = [...config.levelRoles, { level: parseInt(newLevel), roleId: selectedRoleId }];
    setConfig({ ...config, levelRoles: updatedRoles });
    setNewLevel("");
  };

  const save = async () => {
    await fetch('/api/levels', {
      method: 'POST',
      body: JSON.stringify(config)
    });
    alert("✅ تم حفظ إعدادات المستويات بنجاح!");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12" dir="rtl">
      <h1 className="text-3xl font-black mb-10 italic">نظام <span className="text-[#A62DC9]">المستويات والرتب</span> 🏆</h1>

      <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 mb-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">تفعيل نظام التفاعل (XP)</h2>
          <button 
            onClick={() => setConfig({...config, isEnabled: !config.isEnabled})}
            className={`px-6 py-2 rounded-xl font-bold ${config.isEnabled ? 'bg-green-500' : 'bg-gray-700'}`}
          >
            {config.isEnabled ? "مفعل" : "معطل"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-black/30 p-6 rounded-2xl">
          <input 
            type="number" className="bg-white/5 p-4 rounded-xl border border-white/10" 
            placeholder="المستوى (Level)" value={newLevel} onChange={e => setNewLevel(e.target.value)}
          />
          <select 
            className="bg-white/5 p-4 rounded-xl border border-white/10"
            onChange={e => setSelectedRoleId(e.target.value)}
          >
            <option value="">اختر الرتبة...</option>
            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <button onClick={addLevelRole} className="bg-[#A62DC9] rounded-xl font-bold">إضافة مكافأة</button>
        </div>

        <div className="space-y-4">
          <h3 className="text-gray-500 font-bold uppercase text-xs tracking-widest">المكافآت الحالية:</h3>
          {config.levelRoles.map((lr, i) => (
            <div key={i} className="flex justify-between bg-white/5 p-4 rounded-xl border border-white/5">
              <span>مستوى {lr.level}</span>
              <span className="text-[#A62DC9] font-bold">
                {roles.find(r => r.id === lr.roleId)?.name || "رتبة غير معروفة"}
              </span>
              <button onClick={() => {
                const filtered = config.levelRoles.filter((_, idx) => idx !== i);
                setConfig({...config, levelRoles: filtered});
              }} className="text-red-500">حذف</button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={save} className="bg-[#A62DC9] px-12 py-4 rounded-2xl font-black shadow-lg">حفظ الإعدادات 🚀</button>
    </div>
  );
}
