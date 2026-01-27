"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SecurityManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // حالات الإدخال والبيانات
  const [adminId, setAdminId] = useState("");
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [antiLink, setAntiLink] = useState(false);

  // مصفوفة الملاك (الذين يحق لهم إضافة آخرين)
  const OWNER_IDS = ["YOUR_DISCORD_ID_1", "YOUR_DISCORD_ID_2"];
  const isOwner = session?.user?.id && OWNER_IDS.includes(session.user.id);

  // جلب قائمة الإداريين عند تحميل الصفحة
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
    if (!adminId) return alert("يرجى إدخال ID صحيح");
    setLoading(true);
    
    const res = await fetch('/api/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newAdminId: adminId })
    });

    if (res.ok) {
      alert("✅ تمت إضافة الإداري بنجاح");
      setAdminId("");
      fetchAdmins();
    } else {
      const data = await res.json();
      alert(`❌ خطأ: ${data.error}`);
    }
    setLoading(false);
  };

  if (status === "loading") return <div className="min-h-screen bg-black flex items-center justify-center text-[#A62DC9]">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12" dir="rtl">
      <header className="max-w-4xl mx-auto mb-10 flex justify-between items-center">
        <button onClick={() => router.push('/dashboard')} className="text-gray-500 hover:text-[#A62DC9] font-bold">← العودة للوحة الرئيسية</button>
        <h1 className="text-2xl font-black italic">نظام <span className="text-red-500">الحماية والإدارة</span></h1>
      </header>

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* القسم الأول: إضافة المتحكمين (يظهر للملاك فقط) */}
        {isOwner && (
          <section className="bg-white/5 border border-[#A62DC9]/30 p-8 rounded-[2.5rem] backdrop-blur-xl">
            <h2 className="text-xl font-bold mb-6 text-[#A62DC9] flex items-center gap-2">
              <span>🔑</span> إضافة متحكمين جدد
            </h2>
            <div className="flex gap-4 mb-8">
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
                className="bg-[#A62DC9] px-8 rounded-2xl font-black hover:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "جاري الإضافة..." : "إضافة صلاحية"}
              </button>
            </div>

            {/* عرض قائمة المضافين */}
            <div className="space-y-3">
              <p className="text-xs text-gray-500 font-bold uppercase mb-2">الإداريين الحاليين:</p>
              {admins.map((admin) => (
                <div key={admin.discordId} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="font-mono text-sm text-gray-300">{admin.discordId}</span>
                  <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-1 rounded-md font-bold">نشط ✅</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* القسم الثاني: إعدادات الحماية (يظهر للجميع المعتمدين) */}
        <section className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span>🛡️</span> إعدادات حماية السيرفر
          </h2>
          <div className="flex justify-between items-center bg-black/40 p-6 rounded-3xl border border-white/5">
            <div>
              <p className="font-bold">منع الروابط (Anti-Link)</p>
              <p className="text-xs text-gray-500">حذف الروابط تلقائياً لحماية السيرفر من السبام.</p>
            </div>
            <button 
              onClick={() => setAntiLink(!antiLink)}
              className={`w-14 h-8 rounded-full transition-all relative ${antiLink ? 'bg-[#A62DC9]' : 'bg-gray-700'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${antiLink ? 'left-1' : 'left-7'}`} />
            </button>
          </div>
          <button className="w-full mt-8 bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl font-black transition-all">
            حفظ إعدادات الحماية
          </button>
        </section>

      </div>
    </div>
  );
}
