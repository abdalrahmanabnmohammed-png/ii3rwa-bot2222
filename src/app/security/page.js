"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SecurityPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  // ⚠️ أضف الـ IDs الخاصة بالملاك هنا (هؤلاء فقط من سيدخلون حالياً)
  const OWNER_IDS = ["741981934447493160", "000000000000"]; 

  useEffect(() => {
    const checkAccess = async () => {
      if (status === "unauthenticated") {
        router.push('/login');
        return;
      }

      if (status === "authenticated" && session?.user?.id) {
        // 1. فحص هل هو مالك؟
        if (OWNER_IDS.includes(session.user.id)) {
          setIsAuthorized(true);
          setChecking(false);
          return;
        }

        // 2. فحص هل هو إداري مضاف في قاعدة البيانات؟
        try {
          const res = await fetch(`/api/admins/check?id=${session.user.id}`);
          if (res.ok) {
            setIsAuthorized(true);
          } else {
            // إذا لم يكن مالكاً ولا إدارياً، اطرده فوراً
            setIsAuthorized(false);
            alert("عذراً، لا تملك صلاحيات لدخول هذه اللوحة.");
            signOut({ callbackUrl: '/login' });
          }
        } catch (error) {
          console.error("خطأ في التحقق من الصلاحيات");
        }
        setChecking(false);
      }
    };

    checkAccess();
  }, [status, session, router]);

  // شاشة التحميل لمنع ظهور المحتوى لثانية واحدة (Flash of Content)
  if (status === "loading" || checking) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#A62DC9] font-black animate-pulse text-2xl">
          جاري التحقق من الهوية... 🛡️
        </div>
      </div>
    );
  }

  // منع الرندر تماماً إذا لم يكن مخولاً
  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-10" dir="rtl">
      <header className="flex justify-between items-center mb-10 border-b border-white/10 pb-5">
        <h1 className="text-3xl font-black italic">ii3RwA <span className="text-[#A62DC9]">Dashboard</span></h1>
        <div className="flex items-center gap-4">
          <img src={session.user.image} className="w-10 h-10 rounded-full border-2 border-[#A62DC9]" />
          <button onClick={() => signOut()} className="bg-red-500/20 text-red-500 px-4 py-1 rounded-lg text-xs font-bold">خروج</button>
        </div>
      </header>

      <div className="bg-white/5 p-10 rounded-[3rem] border border-[#A62DC9]/30 text-center animate-fade-in">
        <h2 className="text-2xl font-bold mb-4">أهلاً بك في منطقة الحماية ✅</h2>
        <p className="text-gray-400 italic">هذه اللوحة محمية، لا يمكن لأي شخص غريب رؤية ما تراه الآن.</p>
      </div>
    </div>
  );
}
