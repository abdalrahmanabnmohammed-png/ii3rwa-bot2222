"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SecurityPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // ⚠️ ضع الـ IDs هنا بدقة (تأكد أنها داخل علامات تنصيص "")
  const OWNER_IDS = ["741981934447493160", ""]; 

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  // فحص الصلاحية
  const isOwner = session?.user?.id && OWNER_IDS.includes(session.user.id);

  // حماية قصوى: إذا لم يكتمل التحميل أو كان المستخدم متطفلاً
  if (status === "loading") return <div className="min-h-screen bg-black flex items-center justify-center text-[#A62DC9]">جاري فحص الحماية...</div>;
  
  // إذا دخل شخص غريب (ليس مالكاً وليس لديه جلسة)، اطرده فوراً
  if (!session || (!isOwner && status === "authenticated")) {
     // ملاحظة: سنضيف فحص الإداريين من القاعدة لاحقاً، حالياً الملاك فقط هم من يدخلون
     if (!isOwner) {
       return (
         <div className="min-h-screen bg-black text-red-500 flex flex-col items-center justify-center p-5 text-center">
            <h1 className="text-4xl font-bold mb-4">⚠️ وصول غير مصرح به</h1>
            <p>حسابك ({session?.user?.name}) غير مسجل في قائمة الملاك.</p>
            <button onClick={() => signOut()} className="mt-5 bg-white text-black px-6 py-2 rounded-lg font-bold">خروج</button>
         </div>
       );
     }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 relative" dir="rtl">
       {/* تصميمك الجبار هنا */}
       <div className="max-w-4xl mx-auto border border-[#A62DC9]/20 p-10 rounded-[3rem] bg-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-5 mb-10">
            <img src={session.user.image} className="w-16 h-16 rounded-full border-4 border-[#A62DC9]" />
            <div>
              <h1 className="text-2xl font-black">{session.user.name}</h1>
              <span className="bg-[#A62DC9] text-xs px-3 py-1 rounded-full font-bold">👑 مالك المشروع</span>
            </div>
          </div>
          
          <div className="p-10 border-2 border-dashed border-[#A62DC9]/30 rounded-3xl text-center">
             <h2 className="text-xl font-bold mb-4 text-[#A62DC9]">نظام إدارة الملاك فعال ✅</h2>
             <p className="text-gray-400">هذه المنطقة لا يراها إلا الملاك المسجلين في الكود.</p>
          </div>
       </div>
    </div>
  );
}
