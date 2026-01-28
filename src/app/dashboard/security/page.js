"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SecurityManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [adminId, setAdminId] = useState("");
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  const OWNER_IDS = ["741981934447493160", "YOUR_DISCORD_ID_2"];
  const isOwner = session?.user?.id && OWNER_IDS.includes(session.user.id);

  useEffect(() => {
    if (status === "unauthenticated") router.push('/login');
    fetchAdmins();
  }, [status]);

  const fetchAdmins = async () => {
    const res = await fetch('/api/admins');
    if (res.ok) {
      const data = await res.json();
      setAdmins(data.admins || []);
    }
  };

  const handleAddAdmin = async () => {
    if (!adminId) return;
    setLoading(true);
    const res = await fetch('/api/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newAdminId: adminId })
    });
    if (res.ok) { setAdminId(""); fetchAdmins(); }
    setLoading(false);
  };

  const handleDeleteAdmin = async (id) => {
    if (!confirm("هل أنت متأكد من إزالة هذا الإداري؟")) return;
    const res = await fetch(`/api/admins?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchAdmins();
  };

  if (status === "loading") return <div className="min-h-screen bg-black flex items-center justify-center text-[#A62DC9]">جاري التحقق...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.push('/dashboard')} className="mb-6 text-gray-500 hover:text-[#A62DC9] font-bold">← العودة للوحة الرئيسية</button>

        {isOwner && (
          <section className="bg-white/5 border border-[#A62DC9]/30 p-8 rounded-[3rem] shadow-2xl backdrop-blur-md">
            <h2 className="text-xl font-black mb-8 text-[#A62DC9] flex items-center gap-2">🔑 إدارة طاقم الإدارة</h2>
            
            <div className="flex gap-4 mb-10">
              <input 
                type="text" value={adminId} onChange={(e) => setAdminId(e.target.value)}
                placeholder="أدخل Discord User ID"
                className="flex-1 bg-black/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#A62DC9] transition-all"
              />
              <button onClick={handleAddAdmin} disabled={loading} className="bg-[#A62DC9] px-8 rounded-2xl font-black hover:scale-95 transition-all">
                {loading ? "إضافة..." : "إضافة إداري"}
              </button>
            </div>

            <div className="grid gap-4">
              <p className="text-xs text-gray-500 font-bold mb-4 uppercase tracking-[0.2em]">الإداريين المعتمدين:</p>
              {admins.length > 0 ? admins.map((admin) => (
                <div key={admin.discordId} className="flex justify-between items-center bg-white/5 p-4 rounded-[1.5rem] border border-white/5 hover:border-[#A62DC9]/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <img src={admin.avatar} className="w-12 h-12 rounded-full border-2 border-[#A62DC9]/50 shadow-lg" alt="avatar" />
                    <div>
                      <p className="font-bold text-white">{admin.username}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{admin.discordId}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteAdmin(admin.discordId)}
                    className="opacity-0 group-hover:opacity-100 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-xl text-xs font-black transition-all"
                  >
                    إزالة العضو ❌
                  </button>
                </div>
              )) : <p className="text-gray-600 text-sm italic">لا يوجد إداريين مضافين حالياً.</p>}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
