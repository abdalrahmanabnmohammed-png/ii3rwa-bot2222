"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  // ⚠️ ضع هنا الـ IDs الخاصة بالملاك المسئولين عن النظام
  const OWNER_IDS = ["741981934447493160", "YOUR_DISCORD_ID_2"]; 

  const isOwner = session?.user?.id && OWNER_IDS.includes(session.user.id);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    } else if (status === "authenticated") {
      setChecking(false);
    }
  }, [status, router]);

  // مصفوفة الأنظمة مع المسارات الصحيحة (بدون تكرار)
  const botSystems = [
    { id: 'security', name: 'نظام الحماية', icon: '🛡️', color: 'from-red-500/20', desc: 'منع الروابط، حماية الرتب، وفلترة الكلمات.' },
    { id: 'games', name: 'نظام الألعاب', icon: '🎮', color: 'from-blue-500/20', desc: 'أسئلة، فعاليات، ونظام نقاط تفاعلي.' },
    { id: 'welcome', name: 'الترحيب واللفل', icon: '✨', color: 'from-green-500/20', desc: 'رسائل ترحيب احترافية ونظام مستويات.' },
    { id: 'tickets', name: 'نظام التذاكر', icon: '🎫', color: 'from-yellow-500/20', desc: 'نظام دعم فني متكامل عبر الـ Tickets.' },
    { id: 'admin-perms', name: 'إدارة الطاقم', icon: '🔑', color: 'from-purple-500/20', desc: 'توزيع الصلاحيات وإضافة ملاك وإداريين.' },
    { id: 'logs', name: 'السجلات (Logs)', icon: '📜', color: 'from-gray-500/20', desc: 'مراقبة كل تحركات البوت داخل السيرفر.' },
  ];

  if (checking || status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#A62DC9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-black animate-pulse">جاري تحضير الأنظمة الجبارة... 🚀</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 relative overflow-hidden" dir="rtl">
      
      {/* تأثيرات الإضاءة الخلفية */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#A62DC9] opacity-10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600 opacity-5 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* الهيدر الرئيسي */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <img 
                src={session?.user?.image} 
                className="w-16 h-16 rounded-2xl border-2 border-[#A62DC9] transition-transform group-hover:rotate-12" 
                alt="user" 
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-[#0a0a0a] rounded-full shadow-lg"></div>
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter">ii3RwA <span className="text-[#A62DC9]">DASHBOARD</span></h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] bg-[#A62DC9]/20 text-[#A62DC9] px-2 py-0.5 rounded-full font-black uppercase">
                  {isOwner ? "👑 Master Owner" : "🛡️ Staff Member"}
                </span>
                <span className="text-xs text-gray-500 font-bold tracking-widest">{session?.user?.name}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-8 py-3 rounded-2xl border border-red-500/20 transition-all font-black text-sm shadow-lg shadow-red-500/5"
            >
              تسجيل الخروج
            </button>
          </div>
        </header>

        {/* عرض الأنظمة على شكل شبكة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
          {botSystems.map((bot) => (
            <div 
              key={bot.id}
              onClick={() => router.push(`/dashboard/${bot.id}`)}
              className={`group relative bg-gradient-to-br ${bot.color} to-transparent border border-white/5 p-10 rounded-[3.5rem] cursor-pointer hover:border-[#A62DC9]/60 hover:scale-[1.05] transition-all duration-500 overflow-hidden`}
            >
              <div className="text-6xl mb-6 transform group-hover:-translate-y-2 transition-transform duration-500">
                {bot.icon}
              </div>
              <h3 className="text-2xl font-black mb-3 group-hover:text-[#A62DC9] transition-colors">{bot.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                {bot.desc}
              </p>
              
              <div className="flex items-center gap-3 text-[#A62DC9] font-black text-sm">
                <span className="bg-[#A62DC9] text-white p-1 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
                  </svg>
                </span>
                إدارة النظام
              </div>

              {/* تأثير الانعكاس الضوئي */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#A62DC9]/10 rounded-full blur-3xl group-hover:bg-[#A62DC9]/20 transition-all"></div>
            </div>
          ))}
        </div>

        <footer className="mt-24 py-10 border-t border-white/5 flex flex-col items-center gap-4">
          <p className="text-gray-600 font-black text-sm uppercase tracking-[0.3em]">ii3RwA System &copy; 2026</p>
          <div className="flex gap-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all">
             <span className="text-xs font-bold">NEXT.JS 14</span>
             <span className="text-xs font-bold">TAILWIND CSS</span>
             <span className="text-xs font-bold">MONGODB</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
