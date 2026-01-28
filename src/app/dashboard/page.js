"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  // ⚠️ ضع هنا الآيدي الخاص بك (المالك الرئيسي)
  const OWNER_IDS = ["123456789012345678"]; 
  const isOwner = session?.user?.id && OWNER_IDS.includes(session.user.id);

  // مصفوفة الأنظمة البرمجية
  const botSystems = [
    { id: 'security', name: 'نظام الحماية', icon: '🛡️', color: 'from-red-500/20', desc: 'إدارة منع الروابط، السبام، وفلترة الكلمات.' },
    { id: 'welcome', name: 'الترحيب واللفل', icon: '✨', color: 'from-green-500/20', desc: 'إعداد رسائل الترحيب التلقائية ونظام المستويات.' },
    { id: 'games', name: 'نظام الألعاب', icon: '🎮', color: 'from-blue-500/20', desc: 'تفعيل فعاليات وألعاب ذكاء تفاعلية.' },
    { id: 'tickets', name: 'نظام التذاكر', icon: '🎫', color: 'from-yellow-500/20', desc: 'فتح تذاكر الدعم الفني وتجهيز أقسام المساعدة.' },
    { id: 'admin-perms', name: 'إدارة الطاقم', icon: '🔑', color: 'from-purple-500/20', desc: 'إضافة وإزالة الملاك والإداريين والتحكم بالصلاحيات.' },
    { id: 'logs', name: 'السجلات (Logs)', icon: '📜', color: 'from-gray-500/20', desc: 'مراقبة جميع تحركات وعمليات البوت في السيرفر.' },
  ];

  useEffect(() => {
    const verifyAccess = async () => {
      if (status === "unauthenticated") {
        router.push('/login');
        return;
      }

      if (status === "authenticated" && session?.user?.id) {
        // إذا كان مالكاً، اسمح له فوراً
        if (OWNER_IDS.includes(session.user.id)) {
          setIsAuthorized(true);
          setLoading(false);
          return;
        }

        // إذا لم يكن مالكاً، افحص هل هو إداري في القاعدة
        try {
          const res = await fetch('/api/admins/check');
          const data = await res.json();
          if (res.ok && data.ok) {
            setIsAuthorized(true);
          } else {
            alert("⚠️ ليس لديك صلاحية الوصول لهذه اللوحة.");
            signOut({ callbackUrl: '/login' });
          }
        } catch (error) {
          signOut({ callbackUrl: '/login' });
        }
        setLoading(false);
      }
    };

    if (status !== "loading") {
      verifyAccess();
    }
  }, [status, session, router]);

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#A62DC9] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 relative overflow-hidden" dir="rtl">
      {/* لمسة جمالية للخلفية */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#A62DC9] opacity-5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* الهيدر العلوي */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-16 bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img src={session?.user?.image} className="w-16 h-16 rounded-2xl border-2 border-[#A62DC9]" alt="avatar" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-[#0a0a0a] rounded-full"></div>
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter">ii3RwA <span className="text-[#A62DC9]">SYSTEM</span></h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${isOwner ? 'bg-[#A62DC9]/20 text-[#A62DC9]' : 'bg-blue-500/20 text-blue-500'}`}>
                  {isOwner ? "👑 Master Owner" : "🛡️ Bot Admin"}
                </span>
                <span className="text-xs text-gray-500 font-bold">{session?.user?.name}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-8 py-3 rounded-2xl border border-red-500/20 transition-all font-black text-sm"
          >
            تسجيل الخروج
          </button>
        </header>

        {/* شبكة البطاقات مع الفلترة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {botSystems.map((bot) => {
            // إخفاء إدارة الطاقم والسجلات عن الإداريين (تظهر للمالك فقط)
            if ((bot.id === 'admin-perms' || bot.id === 'logs') && !isOwner) {
              return null;
            }

            return (
              <div 
                key={bot.id}
                onClick={() => router.push(`/dashboard/${bot.id}`)}
                className={`group relative bg-gradient-to-br ${bot.color} to-transparent border border-white/5 p-10 rounded-[3.5rem] cursor-pointer hover:border-[#A62DC9]/50 hover:scale-[1.03] transition-all duration-500`}
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">{bot.icon}</div>
                <h3 className="text-2xl font-black mb-3">{bot.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">{bot.desc}</p>
                
                <div className="flex items-center gap-2 text-[#A62DC9] font-black text-xs">
                  <span>فتح الإعدادات</span>
                  <span className="transition-transform group-hover:translate-x-[-5px]">←</span>
                </div>
              </div>
            );
          })}
        </div>

        <footer className="mt-24 text-center">
          <p className="text-gray-700 text-xs font-black uppercase tracking-[0.5em]">ii3RwA Control Panel &copy; 2026</p>
        </footer>
      </div>
    </div>
  );
}
