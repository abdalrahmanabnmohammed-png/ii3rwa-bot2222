"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MainDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  // مصفوفة الملاك 
  const OWNER_IDS = ["741981934447493160", "YOUR_DISCORD_ID_2"]; 

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    } else if (status === "authenticated") {
      if (OWNER_IDS.includes(session?.user?.id)) {
        setIsAuthorized(true);
      } else {
        // هنا يمكن إضافة فحص الإداريين من قاعدة البيانات مستقبلاً
        setIsAuthorized(true); // مؤقتاً للسماح لك بالدخول
      }
      setChecking(false);
    }
  }, [status, session]);

  const botSystems = [
    { id: 'security', name: 'نظام الحماية', icon: '🛡️', color: 'from-red-500/20', desc: 'منع الروابط، السبام، وحماية الرتب.' },
    { id: 'games', name: 'نظام الألعاب', icon: '🎮', color: 'from-blue-500/20', desc: 'فعاليات، أسئلة، ونظام نقاط.' },
    { id: 'welcome', name: 'الترحيب واللفل', icon: '✨', color: 'from-green-500/20', desc: 'رسائل ترحيب مخصصة ونظام لفل.' },
    { id: 'tickets', name: 'نظام التكت', icon: '🎫', color: 'from-yellow-500/20', desc: 'فتح تذاكر الدعم الفني للأعضاء.' },
    { id: 'admin-perms', name: 'صلاحيات الإدارة', icon: '🔑', color: 'from-purple-500/20', desc: 'إدارة طاقم العمل وتوزيع الرتب.' },
    { id: 'logs', name: 'نظام السجلات', icon: '📜', color: 'from-gray-500/20', desc: 'مراقبة كل ما يحدث في السيرفر.' },
  ];

  if (checking) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#A62DC9]">جاري تحميل الأنظمة...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 relative overflow-hidden" dir="rtl">
      {/* خلفية جمالية */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#A62DC9] opacity-10 blur-[120px] rounded-full"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* هيدر الموقع */}
        <header className="flex justify-between items-center mb-16 bg-white/5 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img src={session?.user?.image} className="w-14 h-14 rounded-2xl border-2 border-[#A62DC9] shadow-lg shadow-[#A62DC9]/20" alt="user" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#0a0a0a] rounded-full"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight italic">ii3RwA <span className="text-[#A62DC9]">SYSTEM</span></h1>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">لوحة التحكم المركزية</p>
            </div>
          </div>
          <button onClick={() => signOut()} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-2 rounded-2xl border border-red-500/20 transition-all font-black text-sm">
            خروج
          </button>
        </header>

        {/* شبكة البوتات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {botSystems.map((bot) => (
            <div 
              key={bot.id}
              onClick={() => router.push(`/security/${bot.id}`)}
              className={`group relative bg-gradient-to-br ${bot.color} to-transparent border border-white/5 p-8 rounded-[3rem] cursor-pointer hover:border-[#A62DC9]/50 hover:scale-[1.03] transition-all duration-500 shadow-xl`}
            >
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">{bot.icon}</div>
              <h3 className="text-2xl font-black mb-3">{bot.name}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{bot.desc}</p>
              
              <div className="flex items-center gap-2 text-[#A62DC9] font-bold text-xs">
                <span>إعدادات النظام</span>
                <span className="group-hover:translate-x-[-5px] transition-transform">←</span>
              </div>

              {/* تأثير ضوئي عند الحوم بالماوس */}
              <div className="absolute top-0 left-0 w-full h-full bg-[#A62DC9]/5 opacity-0 group-hover:opacity-100 rounded-[3rem] transition-opacity"></div>
            </div>
          ))}
        </div>

        {/* تذييل الصفحة */}
        <footer className="mt-20 text-center text-gray-600 text-sm font-bold">
          <p>جميع الحقوق محفوظة لـ ii3RwA & JO Store &copy; 2026</p>
        </footer>
      </div>
    </div>
  );
}
