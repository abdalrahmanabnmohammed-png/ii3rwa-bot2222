"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function AdminPermsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [adminId, setAdminId] = useState("");
  const [role, setRole] = useState("Moderator");
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAdmins = useCallback(async () => {
    const res = await fetch('/api/admins');
    if (res.ok) {
      const data = await res.json();
      setAdmins(data.admins || []);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push('/login');
    else if (status === "authenticated") fetchAdmins();
  }, [status, fetchAdmins, router]);

  const handleAddAdmin = async () => {
    if (!adminId || adminId.length < 17) return alert("يرجى إدخال ID صحيح");
    setLoading(true);
    const res = await fetch('/api/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newAdminId: adminId, role: role })
    });
    if (res.ok) {
      setAdminId("");
      fetchAdmins();
      alert("✅ تمت الإضافة بنجاح ومنح الرتبة في السيرفر!");
    } else {
      const errorData = await res.json();
      alert(`❌ خطأ: ${errorData.error}`);
    }
    setLoading(false);
  };

  const deleteAdmin = async (id) => {
    if (!confirm("هل أنت متأكد من سحب الصلاحيات من هذا العضو؟")) return;
    const res = await fetch(`/api/admins?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchAdmins();
      alert("✅ تم الحذف وسحب الرتبة.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black italic">إدارة <span className="text-[#A62DC9]">الطاقم الديناميكي</span></h1>
          <p className="text-gray-500 mt-2">تحكم في الصلاحيات ووزع الرتب تلقائياً من هنا.</p>
        </header>
        
        <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 mb-10 shadow-xl backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              className="bg-black/50 p-4 rounded-2xl border border-white/10 outline-none focus:border-[#A62DC9] transition-all" 
              placeholder="Discord User ID"
              value={adminId} onChange={(e) => setAdminId(e.target.value)}
            />
            <select 
              className="bg-black/50 p-4 rounded-2xl border border-white/10 outline-none"
              value={role} onChange={(e) => setRole(e.target.value)}
            >
              <option value="Moderator">Moderator (مراقب)</option>
              <option value="SuperAdmin">SuperAdmin (مدير كامل)</option>
            </select>
            <button 
              onClick={handleAddAdmin} disabled={loading}
              className="bg-[#A62DC9] font-black rounded-2xl hover:bg-[#8e24ab] transition-all shadow-lg shadow-[#A62DC9]/20"
            >
              {loading ? "جاري الإضافة..." : "منح الصلاحية 🔑"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-gray-600 font-black uppercase tracking-widest mb-4">قائمة المسؤولين الحاليين:</p>
          {admins.map((admin) => (
            <div key={admin.discordId} className="flex justify-between items-center bg-white/5 p-5 rounded-3xl border border-white/5 group hover:border-[#A62DC9]/50 transition-all">
              <div className="flex items-center gap-5">
                <img src={admin.avatar} className="w-14 h-14 rounded-full border-2 border-[#A62DC9]/30" alt="" />
                <div>
                  <p className="font-black text-lg">{admin.username}</p>
                  <p className="text-[10px] bg-[#A62DC9]/20 text-[#A62DC9] px-2 py-0.5 rounded-full inline-block font-black uppercase mt-1">{admin.role}</p>
                </div>
              </div>
              <button onClick={() => deleteAdmin(admin.discordId)} className="text-red-500 font-bold opacity-0 group-hover:opacity-100 transition-all hover:scale-110">إزالة ❌</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
