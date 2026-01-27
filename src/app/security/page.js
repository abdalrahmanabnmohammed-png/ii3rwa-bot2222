"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SecurityPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // إذا انتهى التحقق وتبين أن المستخدم غير مسجل دخوله، يتم طرده فوراً
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  // أثناء التحقق، تظهر صفحة سوداء فارغة لحماية البيانات من الظهور لثانية واحدة
  if (status === "loading") {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">جاري التحقق من الهوية...</div>;
  }

  // إذا لم تكن هناك جلسة، لا تعرض أي شيء (حماية إضافية)
  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-10" dir="rtl">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black">لوحة تحكم <span className="text-[#A62DC9]">ii3RwA</span></h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">{session.user.name}</span>
          <img src={session.user.image} className="w-10 h-10 rounded-full border border-[#A62DC9]" />
        </div>
      </div>

      {/* محتوى لوحة التحكم الجبارة هنا */}
      <div className="max-w-xl bg-white/5 p-8 rounded-3xl border border-white/10">
         <p>أنت الآن في منطقة آمنة ومحمية بحسابك في ديسكورد ✅</p>
      </div>
    </div>
  );
}
