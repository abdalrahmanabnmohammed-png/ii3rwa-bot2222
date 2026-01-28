"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function SecurityManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [adminId, setAdminId] = useState("");
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // ⚠️ ضع هنا الآيدي الخاص بك بدقة
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
      console.error("Fetch error:", error);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    } else if (status === "authenticated") {
      fetchAdmins();
    }
  }, [status, router, fetchAdmins]);

  const handleAddAdmin = async () => {
    if (!adminId || adminId.length < 17) {
      return alert("❌ يرجى إدخال ID صحيح");
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newAdminId: adminId })
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ تمت الإضافة");
        setAdminId("");
        fetchAdmins();
      } else {
        alert(`❌ فشل: ${data.error}`);
      }
    } catch (error) {
      alert("❌ خطأ في السيرفر");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!confirm("هل أنت متأكد؟")) return;
    try {
      const res = await fetch(`/api/admins?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAdmins();
      }
    } catch (error) {
      alert("❌ خطأ في الحذف");
    }
  };

  if (status === "loading" || fetching) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-[#A62DC9]">جاري التحميل...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex justify-between items-center">
          <h1 className="text-2xl font-black italic">إدارة <span className="text-[#A62DC9]">الطاقم</span></h1>
          <button onClick={() => router.push('/dashboard')} className="text-sm text-gray-500 hover:text-white">العودة</button>
        </header>

        {isOwner ? (
          <section className="bg-white/5 p-8 rounded-[2rem] border border-[#A62DC9]/20 shadow-xl mb-10">
            <div className="flex gap-4 mb-6">
              <input 
                type="text" 
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Discord ID"
                className="flex-1 bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-[#A62DC9]"
              />
              <button onClick={handleAddAdmin} disabled={loading} className="bg-[#A62DC9] px-6 rounded-xl font-bold">
                {loading ? "إضافة..." : "إضافة"}
              </button>
            </div>

            <div className="space-y-3">
              {admins.map((admin) => (
                <div key={admin.discordId} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <img src={admin.avatar} className="w-10 h-10 rounded-full" alt="" />
                    <span>{admin.username}</span>
                  </div>
                  <button onClick={() => handleDeleteAdmin(admin.discordId)} className="text-red-500 text-xs">إزالة</button>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="p-10 bg-red-500/5 rounded-3xl border border-red-500/10 text-center text-gray-500">
            أنت لا تملك صلاحيات المالك لإضافة إداريين.
          </div>
        )}
      </div>
    </div>
  );
}
