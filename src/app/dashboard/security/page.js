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

  // ⚠️ ضع هنا الآيدي الخاص بك (المالك) لضمان ظهور خانة الإضافة
  const OWNER_IDS = ["741981934447493160"]; 
  const isOwner = session?.user?.id && OWNER_IDS.includes(session.user.id);

  // دالة جلب الإداريين من قاعدة البيانات
  const fetchAdmins = useCallback(async () => {
    try {
      const res = await fetch('/api/admins');
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.admins || []);
      }
    } catch (error) {
      console.error("Failed to fetch admins:", error);
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

  // دالة إضافة إداري جديد
  const handleAddAdmin = async () => {
    if (!adminId || adminId.length < 17) {
      return alert("❌ يرجى إدخال ID ديسكورد صحيح (17-19 رقم)");
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
        alert("✅ تمت إضافة الإداري بنجاح");
        setAdminId("");
        fetchAdmins();
      } else {
        alert(`❌ فشل: ${data.error}`);
      }
    } catch (error) {
      alert("❌ خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  // دالة إزالة إداري
  const handleDeleteAdmin = async (id) => {
    if (!confirm("هل أنت متأكد من إزالة هذا العضو من الإدارة؟")) return;

    try {
      const res = await fetch(`/api/admins?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert("✅ تم حذف الإداري");
        fetchAdmins();
      } else {
        const data = await res.json();
        alert(`❌ فشل الحذف: ${data.error}`);
      }
    } catch (error) {
      alert("❌ خطأ في الاتصال");
    }
  };

  if (status === "loading" || fetching) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#A62DC9] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 relative overflow-hidden" dir="rtl">
      {/* تأثيرات الإضاءة */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#A62DC9] opacity-5 blur-[120px] rounded-full"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <button 
          onClick={() => router.push('/dashboard')}
          className="mb-8 text-gray-500 hover:text-[#A62DC9] transition-all flex items-center gap-2 font-bold"
        >
          <span>→</span> العودة للوحة الرئيسية
        </button>

        <header className="mb-12">
          <h1 className="text-3xl font-black italic tracking-tighter">نظام <span className="text-[#A62DC9]">الإدارة والوصول</span></h1>
          <p className="text-gray-500 text-sm mt-2">إدارة الأشخاص المصرح لهم بالتحكم في بوت ii3RwA</p>
        </header>

        {/* --- قسم المالك (إضافة أعضاء) --- */}
        {isOwner ? (
          <section className="bg-white/5 border border-[#A62DC9]/30 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-md mb-12">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-[#A62DC9]">
              <span className="p-2 bg-[#A62DC9]/10 rounded-lg">🔑</span>
              منح صلاحيات إدارية
            </h2>
            <div className="flex flex-col md:flex-row gap-4 mb-10">
              <input 
                type="text" 
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="أدخل Discord User ID"
                className="flex-1 bg-black/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#A62DC9] transition-all"
              />
              <button 
                onClick={handleAddAdmin}
                disabled={loading}
                className="bg-[#A62DC9] hover:bg-[#8e24ab] px-10 py-4 rounded-2xl font-black transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "جاري الإضافة..." : "إضافة الآن"}
              </button>
            </div>

            {/* عرض طاقم الإدارة */}
            <div className="space-y-4">
              <p className="text-xs text-gray-500 font-black uppercase tracking-[0.2em] mb-4">طاقم الإدارة الحالي:</p>
              {admins.length > 0 ? admins.map((admin) => (
                <div key={admin.discordId} className="group flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-[#A62DC9]/30 transition-all">
                  <div className="flex items-center gap-4">
                    <img src={admin.avatar} className="w-12 h-12 rounded-full border-2 border-[#A62DC9]/30 shadow-md" alt="pfp" />
                    <div>
                      <p className="font-bold text-white group-hover:text-[#A62DC9] transition-colors">{admin.username}</p>
                      <p className="text-[10px] text-gray-600 font-mono tracking-tighter">{admin.discordId}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteAdmin(admin.discordId)}
                    className="opacity-0 group-hover:opacity-100 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-xl text-xs font-black transition-all"
                  >
                    إزالة ❌
                  </button>
                </div>
              )) : (
                <p className="text-gray-600 italic text-sm text-center py-4">لا يوجد إداريين مضافين حالياً.</p>
              )}
            </div>
          </section>
        ) : (
          <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-[2rem] text-center mb-10">
            <h3 className="text-red-500 font-bold mb-2">🛡️ وضع العرض فقط</h3>
            <p className="text-gray-500 text-sm">أنت لا تملك صلاحية "المالك" لإضافة أو إزالة الإداريين.</p>
          </div>
        )}

        {/* قسم الحماية العامة */}
        <section className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
          <h2 className="text-xl font-bold mb-6">إعدادات البوت 🛡️</h2>
          <div className="p-6 bg-black/40 rounded-3xl border border-white/5 flex justify-between items-center">
            <span className="font-bold">نظام منع الروابط (Anti-Link)</span>
            <div className="text-[#A62DC9] text-xs font-bold bg-[#A62DC9]/10 px-3 py-1 rounded-full uppercase">قيد التطوير</div>
          </div>
        </section>
      </div>
    </div>
  );
}
