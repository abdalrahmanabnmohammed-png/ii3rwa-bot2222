"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SecurityPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [antiLink, setAntiLink] = useState(false);
  const [newAdminId, setNewAdminId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // --- قائمة الملاك (Owners) ---
  // ضع هنا الـ ID الخاص بك والـ ID الخاص بالمالك الثاني
  const OWNER_IDS = [
    "741981934447493160", 
    "YOUR_DISCORD_ID_2"
  ]; 

  const isOwner = session?.user?.id && OWNER_IDS.includes(session.user.id);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  const handleAddAdmin = async () => {
    if (!newAdminId) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newAdminId })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ تم إضافة الإداري بنجاح");
        setNewAdminId("");
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage("❌ خطأ في الاتصال");
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  if (status === "loading") return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white font-bold animate-pulse">جاري التحقق من الصلاحيات...</div>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 relative overflow-hidden" dir="rtl">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#A62DC9] opacity-5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-12 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-4">
            <img src={session.user.image} className="w-12 h-12 rounded-full border-2 border-[#A62DC9]" alt="avatar" />
            <div>
              <p className="font-black text-lg">{session.user.name}</p>
              <p className="text-[10px] text-[#A62DC9] font-bold uppercase tracking-widest px-2 py-0.5 bg-[#A62DC9]/10 rounded-full inline-block">
                {isOwner ? "👑 OWNER / مالك" : "🛡️ ADMIN / إداري"}
              </p>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-5 py-2 rounded-xl border border-red-500/20 transition-all font-bold text-sm">
            خروج
          </button>
        </header>

        {isOwner && (
          <section className="mb-10 animate-fade-in">
            <div className="bg-white/5 border-2 border-[#A62DC9]/30 p-8 rounded-[2.5rem] shadow-2xl">
              <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                إدارة طاقم الإدارة (صلاحيات الملاك)
              </h2>
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="text" 
                  placeholder="Discord ID للإداري الجديد"
                  className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-[#A62DC9] transition-all"
                  value={newAdminId}
                  onChange={(e) => setNewAdminId(e.target.value)}
                />
                <button onClick={handleAddAdmin} disabled={loading} className="bg-[#A62DC9] hover:bg-[#8e24ab] px-10 py-4 rounded-2xl font-black transition-all shadow-lg active:scale-95 disabled:opacity-50">
                  {loading ? "جاري الحفظ..." : "إضافة إداري"}
                </button>
              </div>
              {message && <p className="mt-4 text-center font-bold text-sm">{message}</p>}
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-[#A62DC9]/40 transition-all">
            <h3 className="text-xl font-black mb-2 italic">نظام منع الروابط 🔗</h3>
            <button onClick={() => setAntiLink(!antiLink)} className={`w-full py-3 rounded-xl font-bold border mt-4 transition-all ${antiLink ? 'bg-[#A62DC9]/10 border-[#A62DC9] text-[#A62DC9]' : 'bg-gray-800/50 border-gray-700 text-gray-500'}`}>
              {antiLink ? "الحماية مفعلة ✅" : "الحماية معطلة ❌"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
