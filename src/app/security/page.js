"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function SecurityPage() {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [antiLink, setAntiLink] = useState(false);

  // 1. مصفوفة الملاك (صلاحيات كاملة)
  const OWNER_IDS = ["741981934447493160", "000000000000000000"]; 

  const isOwner = session?.user?.id && OWNER_IDS.includes(session.user.id);

  // 2. التحقق من الإداريين (سنقوم بجلبهم من MongoDB)
  useEffect(() => {
    const checkAccess = async () => {
      if (isOwner) {
        setIsAdmin(true);
        return;
      }
      
      // هنا نقوم بسؤال السيرفر: هل هذا المستخدم إداري؟
      const res = await fetch(`/api/admins/check?id=${session?.user?.id}`);
      if (res.ok) setIsAdmin(true);
    };

    if (session) checkAccess();
  }, [session, isOwner]);

  if (status === "loading") return <div className="text-white text-center mt-20">جاري فحص الرتبة...</div>;

  // حماية: إذا لم يكن مالكاً ولا إدارياً، اطرده
  if (!isAdmin && !isOwner) {
    return <div className="text-red-500 text-center mt-20 font-bold italic">⚠️ ليس لديك صلاحية للوصول لهذه اللوحة</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8" dir="rtl">
      {/* هيدر ترحيبي يتغير حسب الرتبة */}
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black italic">لوحة تحكم <span className="text-[#A62DC9]">ii3RwA</span></h1>
          <p className="text-xs text-gray-500">مرحباً {session.user.name} ({isOwner ? "مالك" : "إداري"})</p>
        </div>
      </div>

      {/* --- قسم المالك فقط (إدارة الفريق) --- */}
      {isOwner && (
        <div className="mb-10 p-6 bg-[#A62DC9]/5 border border-[#A62DC9]/20 rounded-3xl">
          <h2 className="text-lg font-bold text-[#A62DC9] mb-4">👑 إدارة الإداريين (للمالك فقط)</h2>
          <div className="flex gap-3">
             <input type="text" placeholder="Discord ID" className="bg-white/5 p-3 rounded-xl flex-1 border border-white/10" />
             <button className="bg-[#A62DC9] px-6 rounded-xl font-bold">إضافة</button>
          </div>
        </div>
      )}

      {/* --- قسم الإداريين والمالك (خصائص التحكم بالبوت) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem]">
          <h3 className="text-xl font-bold mb-4 italic">الحماية العامة 🛡️</h3>
          <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl">
            <span>تفعيل منع الروابط</span>
            <button 
              onClick={() => setAntiLink(!antiLink)}
              className={`px-4 py-2 rounded-lg font-bold ${antiLink ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}
            >
              {antiLink ? "مفعل" : "معطل"}
            </button>
          </div>
        </div>

        <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] opacity-50">
          <h3 className="text-xl font-bold mb-2 italic">نظام الترحيب (قريباً) 👋</h3>
          <p className="text-xs text-gray-500 text-left">Coming Soon</p>
        </div>
      </div>
    </div>
  );
}
