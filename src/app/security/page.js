"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function SecurityPage() {
  const { data: session, status } = useSession();
  const [newAdminId, setNewAdminId] = useState("");
  const [adminsList, setAdminsList] = useState([]); // سيتم جلبها من المونجو لاحقاً
  
  // ضع الأيدي الخاص بك هنا (المالك الوحيد)
  const OWNER_ID = "YOUR_DISCORD_ID_HERE"; 

  const isOwner = session?.user?.id === OWNER_ID;

  const handleAddAdmin = async () => {
    if (!isOwner) return alert("فقط المالك يمكنه إضافة إداريين!");
    // كود إرسال الأيدي لقاعدة البيانات MongoDB
    console.log("إضافة إداري جديد:", newAdminId);
    setNewAdminId("");
  };

  if (status === "loading") return <div className="text-white text-center mt-20">جاري التحقق...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8" dir="rtl">
      <h1 className="text-3xl font-black mb-10">لوحة تحكم <span className="text-[#A62DC9]">ii3RwA</span></h1>

      {/* قسم خاص بالمالك فقط - لإضافة الإداريين */}
      {isOwner && (
        <div className="mb-12 p-6 bg-white/5 border-2 border-[#A62DC9]/30 rounded-[2rem] animate-fade-in">
          <h2 className="text-xl font-bold mb-4 text-[#A62DC9]">👑 إدارة طاقم العمل (للمالك فقط)</h2>
          <div className="flex gap-4">
            <input 
              type="text" 
              value={newAdminId}
              onChange={(e) => setNewAdminId(e.target.value)}
              placeholder="ضع Discord ID للإداري الجديد"
              className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#A62DC9]"
            />
            <button 
              onClick={handleAddAdmin}
              className="bg-[#A62DC9] px-8 rounded-xl font-bold hover:bg-[#8e24ab] transition"
            >
              إضافة إداري
            </button>
          </div>
        </div>
      )}

      {/* باقي أدوات التحكم (تظهر لكل الإداريين المعتمدين) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
          <h3 className="text-xl font-bold mb-2">🛡️ حماية السيرفر</h3>
          <p className="text-gray-400">هذا القسم متاح لك وللإداريين الذين قمت بإضافتهم.</p>
        </div>
      </div>
    </div>
  );
}
