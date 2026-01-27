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

  // ⚠️ تأكد أن هذه الأرقام مطابقة تماماً للـ ID الخاص بك (بدون مسافات)
  const OWNER_IDS = ["741981934447493160", "000000000000000000"];
  
  // التحقق من صلاحية المالك
  const isOwner = session?.user?.id && OWNER_IDS.includes(session.user.id);

  useEffect(() => {
    if (status === "unauthenticated") router.push('/login');
    if (isOwner) fetchAdmins(); // جلب القائمة فقط إذا كان مالكاً
  }, [status, isOwner]);

  const fetchAdmins = async () => {
    const res = await fetch('/api/admins');
    if (res.ok) {
      const data = await res.json();
      setAdmins(data.admins || []);
    }
  };

  const handleAddAdmin = async () => {
    if (!adminId) return alert("أدخل ID صحيح");
    setLoading(true);
    const res = await fetch('/api/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newAdminId: adminId })
    });
    if (res.ok) {
      alert("✅ تمت الإضافة بنجاح");
      setAdminId("");
      fetchAdmins();
    } else {
      const data = await res.json();
      alert(`❌ ${data.error}`);
    }
    setLoading(false);
  };

  if (status === "loading") return <div className="min-h-screen bg-black flex items-center justify-center text-[#A62DC9]">جاري التحقق...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12" dir="rtl">
      
      {/* للتأكد من الـ ID الخاص بك (يمكنك حذفه لاحقاً) */}
      <div className="text-[10px] text-gray-700 mb-2">DEBUG: Your ID is {session?.user?.id}</div>

      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.push('/dashboard')} className="mb-6 text-gray-500 hover:text-[#A62DC9] font-bold">← العودة للوحة الرئيسية</button>

        {/* خانة إضافة الإداريين - تظهر فقط للملاك */}
        {isOwner ? (
          <section className="bg-white/5 border border-[#A62DC9]/30 p-8 rounded-[2.5rem] mb-10 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-[#A62DC9]">🔑 إضافة صلاحيات التحكم</h2>
            <div className="flex gap-4 mb-8">
              <input 
                type="text" 
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="أدخل Discord ID"
                className="flex-1 bg-black/50 border border-white/10 p-4 rounded-xl outline-none focus:border-[#A62DC9]"
              />
              <button onClick={handleAddAdmin} disabled={loading} className="bg-[#A62DC9] px-8 rounded-xl font-bold">
                {loading ? "جاري الإرسال..." : "إضافة إداري"}
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-gray-500 font-bold mb-2">طاقم الإدارة المضاف:</p>
              {admins.length > 0 ? admins.map((admin) => (
                <div key={admin._id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-sm font-mono">{admin.discordId}</span>
                  <span className="text-[10px] text-green-500 font-bold">معتمد ✅</span>
                </div>
              )) : <p className="text-gray-600 text-sm italic">لا يوجد إداريين مضافين حالياً.</p>}
            </div>
          </section>
        ) : (
          <div className="bg-red-500/10 p-10 rounded-3xl border border-red-500/20 text-center">
             <h2 className="text-xl font-bold text-red-500 mb-2">🛡️ وصول محدود</h2>
             <p className="text-gray-400">أنت الآن في وضع "الإداري"، يمكنك التحكم في خصائص البوت فقط ولا يمكنك إضافة إداريين آخرين.</p>
          </div>
        )}
      </div>
    </div>
  );
}
