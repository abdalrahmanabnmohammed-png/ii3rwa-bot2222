"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  // ⚠️ القائمة البيضاء للملاك (Owners) - هؤلاء فقط من يدخلون افتراضياً
  const OWNER_IDS = ["741981934447493160", "YOUR_DISCORD_ID_2"]; 

  useEffect(() => {
    const verifyAccess = async () => {
      // 1. إذا لم يسجل دخوله أصلاً، اطرده لصفحة اللوجن
      if (status === "unauthenticated") {
        router.push('/login');
        return;
      }

      if (status === "authenticated" && session?.user?.id) {
        // 2. فحص هل هو مالك؟ (الفحص الأول في الكود)
        if (OWNER_IDS.includes(session.user.id)) {
          setIsAuthorized(true);
          setLoading(false);
          return;
        }

        // 3. فحص هل هو إداري معتمد؟ (الفحص الثاني من قاعدة البيانات)
        try {
          const res = await fetch(`/api/admins/check?id=${session.user.id}`);
          if (res.ok) {
            setIsAuthorized(true);
          } else {
            // ❌ طرد قسري لمن لا يملك صلاحية
            alert("⚠️ وصول غير مصرح به! ليس لديك صلاحيات إدارية.");
            signOut({ callbackUrl: '/login' });
          }
        } catch (error) {
          console.error("خطأ في فحص الصلاحيات");
          signOut({ callbackUrl: '/login' });
        }
        setLoading(false);
      }
    };

    if (status !== "loading") {
      verifyAccess();
    }
  }, [status, session, router]);

  // قائمة أنظمة البوتات (كل بطاقة توجه لمسارها الصحيح)
  const botSystems = [
    { id: 'security', name: 'نظام الحماية', icon: '🛡️', color: 'from-red-500/20', desc: 'منع الروابط، حماية الرتب، وفلترة الكلمات.' },
    { id: 'games', name: 'نظام الألعاب', icon: '🎮', color: 'from-blue-500/20', desc: 'أسئلة، فعاليات، ونظام نقاط تفاعلي.' },
    { id: 'welcome', name: 'الترحيب واللفل', icon: '✨', color: 'from-green-500/20', desc: 'رسائل ترحيب احترافية ونظام مستويات.' },
    { id: 'tickets', name: 'نظام التذاكر', icon: '🎫', color: 'from-yellow-500/20', desc: 'نظام دعم فني متكامل عبر الـ Tickets.' },
    { id: 'admin-perms', name: 'إدارة الطاقم', icon: '🔑', color: 'from-purple-500/20', desc: 'إضافة ملاك وإداريين وتوزيع الصلاحيات.' },
    { id: 'logs', name: 'السجلات (Logs)', icon: '📜', color: 'from-gray-500/20', desc: 'مراقبة كل تحركات البوت داخل السيرفر.' },
  ];

  // شاشة الفحص (تمنع ظهور أي بيانات للمتسلل)
  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#A62DC9] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#A62DC9] font-black tracking-widest animate-pulse">SECURITY CHECKING...</p>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 relative overflow-hidden" dir="rtl">
      
      {/* لمسات جمالية للخلفية */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#A62DC9] opacity-5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* هيدر اللوحة */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-16 bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-5">
            <img src={session?.user?.image} className="w-14 h-14 rounded-2xl border-2 border-[#A62DC9]" alt="avatar" />
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter">ii3RwA <span className="text-[#A62DC9]">SYSTEM</span></h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                أهلاً بك، {session?.user?.name} | {OWNER_IDS.includes(session?.user?.id) ? "المالك" : "إداري"}
              </p>
            </div>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-2 rounded-2xl border border-red-500/20 transition-all font-bold text-sm"
          >
            تسجيل الخروج
          </button>
        </header>

        {/* شبكة الأنظمة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {botSystems.map((bot) => (
            <div 
              key={bot.id}
              onClick={() => router.push(`/dashboard/${bot.id}`)}
              className={`group relative bg-gradient-to-br ${bot.color} to-transparent border border-white/5 p-10 rounded-[3rem] cursor-pointer hover:border-[#A62DC9]/50 hover:scale-[1.03] transition-all duration-500`}
            >
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">{bot.icon}</div>
              <h3 className="text-2xl font-black mb-3">{bot.name}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">{bot.desc}</p>
              
              <div className="flex items-center gap-2 text-[#A62DC9] font-bold text-xs">
                <span>إدارة النظام</span>
                <span className="transition-transform group-hover:translate-x-[-5px]">←</span>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-24 text-center text-gray-700 text-xs font-bold uppercase tracking-[0.5em]">
          ii3RwA System &copy; 2026
        </footer>
      </div>
    </div>
  );
}
