"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AntiLinkPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);

  // حماية المسار: التأكد من تسجيل الدخول
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  if (status === "loading") return <div className="min-h-screen bg-black flex items-center justify-center text-[#A62DC9]">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12" dir="rtl">
      {/* زر العودة للوحة التحكم الرئيسية */}
      <button 
        onClick={() => router.push('/dashboard')}
        className="mb-8 text-gray-500 hover:text-[#A62DC9] transition-colors flex items-center gap-2 font-bold"
      >
        <span>→</span> العودة للوحة الرئيسية
      </button>

      <div className="max-w-3xl mx-auto border border-white/5 bg-white/5 p-10 rounded-[3rem] backdrop-blur-2xl shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-red-500/20 p-4 rounded-2xl text-3xl">🛡️</div>
          <div>
            <h1 className="text-3xl font-black italic">نظام <span className="text-red-500">حماية السيرفر</span></h1>
            <p className="text-gray-500 text-sm">تحكم في منع الروابط والسبام بشكل آلي</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center bg-black/40 p-6 rounded-3xl border border-white/5">
            <div>
              <p className="font-bold text-lg">خاصية منع الروابط</p>
              <p className="text-xs text-gray-500">سيتم حذف أي رابط (http/https) فور إرساله.</p>
            </div>
            <button 
              onClick={() => setEnabled(!enabled)}
              className={`w-16 h-8 rounded-full transition-all relative ${enabled ? 'bg-green-500' : 'bg-gray-700'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${enabled ? 'left-1' : 'left-9'}`} />
            </button>
          </div>
        </div>

        <button className="w-full mt-10 bg-[#A62DC9] py-5 rounded-2xl font-black text-xl hover:shadow-[0_0_30px_-5px_#A62DC9] transition-all active:scale-95">
          حفظ الإعدادات في البوت 🚀
        </button>
      </div>
    </div>
  );
}
