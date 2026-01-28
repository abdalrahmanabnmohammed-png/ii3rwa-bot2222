"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function AdminPermsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [adminId, setAdminId] = useState("");
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  // ⚠️ ضع الآيدي الخاص بك هنا
  const OWNER_IDS = ["741981934447493160"]; 
  const isOwner = session?.user?.id && OWNER_IDS.includes(session.user.id);

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await fetch('/api/admins');
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.admins || []);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    } else if (status === "authenticated" && !isOwner) {
      // إذا لم يكن مالكاً، ارجعه للوحة التحكم الرئيسية
      router.push('/dashboard');
    } else if (status === "authenticated") {
      fetchAdmins();
    }
  }, [status, isOwner, router, fetchAdmins]);

  const handleAddAdmin = async () => {
    if (!adminId) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newAdminId: adminId })
      });
      if (res.ok) {
        setAdminId("");
        fetchAdmins();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!confirm("هل أنت متأكد؟")) return;
    const res = await fetch(`/api/admins?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchAdmins();
  };

  if (status === "loading") return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-12" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.push('/dashboard')} className="mb-8 text-gray-500 font-bold">← عودة</button>
        <h1 className="text-3xl font-black mb-10 italic">إدارة <span className="text-[#A62DC9]">الطاقم</span></h1>

        <section className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
          <div className="flex gap-4 mb-10">
            <input 
              type="text" value={adminId} onChange={(e) => setAdminId(e.target.value)}
              placeholder="Discord ID"
              className="flex-1 bg-black/50 border border-white/10 p-4 rounded-2xl outline-none"
            />
            <button onClick={handleAddAdmin} disabled={loading} className="bg-[#A62DC9] px-8 rounded-2xl font-bold">إضافة</button>
          </div>

          <div className="space-y-4">
            {admins.map((admin) => (
              <div key={admin.discordId} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 group">
                <div className="flex items-center gap-4">
                  <img src={admin.avatar} className="w-10 h-10 rounded-full" alt="" />
                  <span className="font-bold">{admin.username}</span>
                </div>
                <button onClick={() => handleDeleteAdmin(admin.discordId)} className="text-red-500 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all">إزالة ❌</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
