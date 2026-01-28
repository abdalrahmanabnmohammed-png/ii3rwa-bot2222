"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function AdvancedPermsPage() {
  const [adminId, setAdminId] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [perms, setPerms] = useState({
    canAccessDashboard: false,
    canManageTickets: false,
    isAdminInServer: false
  });

  useEffect(() => {
    fetch('/api/guild/roles').then(res => res.json()).then(data => setRoles(data.roles || []));
  }, []);

  const handleSave = async () => {
    const res = await fetch('/api/admins', {
      method: 'POST',
      body: JSON.stringify({ 
        newAdminId: adminId, 
        selectedRoleId: selectedRole, 
        permissions: perms 
      })
    });
    if (res.ok) alert("✅ تم ضبط الصلاحيات بنجاح!");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-10" dir="rtl">
      <h1 className="text-3xl font-black mb-10 italic">نظام <span className="text-[#A62DC9]">توزيع الصلاحيات</span></h1>
      
      <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 grid gap-6">
        <input 
          className="bg-black/50 p-4 rounded-xl border border-white/10 outline-none" 
          placeholder="Discord User ID" 
          onChange={(e) => setAdminId(e.target.value)}
        />

        <select 
          className="bg-black/50 p-4 rounded-xl border border-white/10 outline-none"
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">اختر الرتبة من السيرفر...</option>
          {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>

        <div className="space-y-4 bg-black/30 p-6 rounded-2xl">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" onChange={(e) => setPerms({...perms, canAccessDashboard: e.target.checked})} />
            <span>السماح بدخول لوحة التحكم 💻</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" onChange={(e) => setPerms({...perms, canManageTickets: e.target.checked})} />
            <span>إدارة التذاكر داخل السيرفر 🎫</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" onChange={(e) => setPerms({...perms, isAdminInServer: e.target.checked})} />
            <span>صلاحيات إدارية داخل السيرفر 🛡️</span>
          </label>
        </div>

        <button onClick={handleSave} className="bg-[#A62DC9] p-4 rounded-2xl font-black">حفظ ومنح الرتبة</button>
      </div>
    </div>
  );
}
